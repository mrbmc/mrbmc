#!/bin/zsh

# Convert BASE to absolute path
BASE=$(cd "$(dirname "$0")" && pwd);

start_date=$(date -v-30d +%Y%m%d);
start_day=$(date -j -f %Y%m%d $start_date +%d);
start_month=$(date -j -f %Y%m%d $start_date +%m);
start_seconds=$(date -j -f %Y%m%d $start_date +%s)

stop_date=$(date +%Y%m%d);
stop_day=$(date -j -f %Y%m%d $stop_date +%d);
stop_month=$(date -j -f %Y%m%d $stop_date +%m);
stop_seconds=$(date -j -f %Y%m%d $stop_date +%s)

this_year=$(date -j +%Y);
this_month=$(date -j +%m);
this_day=$(date -j +%d);

local flag_skipdownload flag_skipfilter flag_verbose flag_help flag_raw flag_update_blacklists
local usage=(
"metrics.sh [-h|--help]"
"metrics.sh [-v|--verbose] [-s|--skipdownload] [-r|--raw] [-f|--from=<YYYYMMDD>] [-u|--until=<YYYYMMDD>] [-t|--term=<duration>] [-i|--ip=ip.to.investigate]"
"metrics.sh [-b|--update-blacklists] - Fetch and merge public IP/UA blocklists"
)

goaccess_opt="--log-format=CLOUDFRONT "
goaccess_opt+="--no-query-string "
goaccess_opt+="--agent-list "
goaccess_opt+="--ignore-crawlers "
goaccess_opt+="--unknowns-as-crawlers "
goaccess_opt+="--tz='America/New_York' "

# GeoIP database: prefer bundled copy in `metrics/` if present, otherwise fall back to common homebrew path
GEOIP_DB=""
if [ -f "$BASE/GeoLite2-City_20250401/GeoLite2-City.mmdb" ]; then
    GEOIP_DB="$BASE/GeoLite2-City_20250401/GeoLite2-City.mmdb"
elif [ -f "/opt/homebrew/var/GeoIP/GeoLite2-City.mmdb" ]; then
    GEOIP_DB="/opt/homebrew/var/GeoIP/GeoLite2-City.mmdb"
fi


# ==================================================
# FUNCTIONS
# ==================================================


function download () {

	if [[ "$flag_skipdownload" ]]; then
		echo "========================================";
		echo "SKIP DOWNLOAD";
		return;
	fi

	echo "========================================";
	echo "DOWNLOADING DATA from s3://brianmcconnell.me";
	[[ -z "$flag_verbose" ]] || { echo "----------------------------------------";}

	if (( $#flag_verbose )); then
		aws s3 sync s3://brianmcconnell.me $BASE/downloads --exclude "*" --include "*.$this_year-$this_month*.gz"
	else
		aws s3 sync s3://brianmcconnell.me $BASE/downloads --exclude "*" --include "*.$this_year-$this_month*.gz" --quiet
	fi

	#NOTE: you can't unzip all files for a year so we go month by month
	#gunzip -c -k -f $BASE'/downloads/E1TNSK7JF24IAY.2024-0'* | grep  -E -v -i -f ../blacklist.txt | goaccess  -o ../www/2024.html --log-format=CLOUDFRONT --no-query-string --agent-list --ignore-crawlers --unknowns-as-crawlers --tz="America/New York"
	#zcat -f logs/log_clean0* 

    local diff_days=$(((stop_seconds - start_seconds) / 86400))
	local last_date="";

	[[ -z "$flag_verbose" ]] || { echo "----------------------------------------";}

	for ((i = $diff_days; i > 0; i--)); do

	    target_date=$(date -v-$i"d" -j -f %Y%m%d $stop_date +%Y-%m)

	    if [[ $target_date != $last_date ]]; then

			[[ -z "$flag_verbose" ]] || { echo "unzipping $target_date"; }
			gunzip -c -k -f $BASE'/downloads/E1TNSK7JF24IAY.'$target_date*'gz' | grep -i -v -E "^#(Version|Fields)" > $BASE'/logs/log_raw_'$target_date;

			last_date=$target_date;
		fi

	done
}

function parse () {
	if [[ "$flag_skipfilter" ]]; then
		echo "========================================";
		echo "SKIP FILTER";
		return;
	fi

    echo "========================================";
    echo "PREPARING DATA" $1;
    [[ -z "$flag_verbose" ]] || { echo "----------------------------------------";}

    if (( $#flag_raw )); then
        [[ -z "$flag_verbose" ]] || { echo "Concatenating all raw logs"; }
        zcat -f $BASE/logs/log_raw_202* > $BASE/logs/log_raw;
    else
        local diff_days=$(((stop_seconds - start_seconds) / 86400))
        local last_date="";
        local timer_start timer_end timer_elapsed

        [[ -z "$flag_verbose" ]] || { echo "Preparing filters..."; }
        
        # Timer: Start building awk script
        timer_start=$(date +%s%N)
        [[ -z "$flag_verbose" ]] || { echo "  [TIMER] Starting awk script build..."; }
        
        # Build awk script for fast single-pass filtering
        local awk_script='
        BEGIN {
            FS = "\t";  # CloudFront logs are tab-delimited
            
            # Timer: Start loading blacklist-agents
            print "TIMER:load_agents_start" > "/dev/stderr";
            fflush("/dev/stderr");
            
            # Load user-agent patterns (case-insensitive regex)
            agent_count = 0;
            while ((getline line < "'$BASE'/blacklists/blacklist-agents.txt") > 0) {
                if (line !~ /^#/ && line !~ /^[[:space:]]*$/) {
                    agent_patterns[++agent_count] = tolower(line);
                }
            }
            close("'$BASE'/blacklists/blacklist-agents.txt");
            print "TIMER:load_agents_end:" agent_count > "/dev/stderr";
            fflush("/dev/stderr");
            
            # Timer: Start loading blacklist-ips
            print "TIMER:load_ips_start" > "/dev/stderr";
            fflush("/dev/stderr");
            
            # Load IP addresses into hash for O(1) lookup
            ip_count = 0;
            while ((getline line < "'$BASE'/blacklists/blacklist-ips.txt") > 0) {
                if (line !~ /^#/ && line !~ /^[[:space:]]*$/) {
                    blocked_ips[line] = 1;
                    ip_count++;
                }
            }
            close("'$BASE'/blacklists/blacklist-ips.txt");
            print "TIMER:load_ips_end:" ip_count > "/dev/stderr";
            fflush("/dev/stderr");
            
            # Timer: Start loading blacklist-urls
            print "TIMER:load_urls_start" > "/dev/stderr";
            fflush("/dev/stderr");
            
            # Load URL patterns (case-insensitive regex)
            url_count = 0;
            while ((getline line < "'$BASE'/blacklists/blacklist-urls.txt") > 0) {
                if (line !~ /^#/ && line !~ /^[[:space:]]*$/) {
                    url_patterns[++url_count] = tolower(line);
                }
            }
            close("'$BASE'/blacklists/blacklist-urls.txt");
            print "TIMER:load_urls_end:" url_count > "/dev/stderr";
            fflush("/dev/stderr");
            
            filter_browser = 0;
            filter_method = 0;
            filter_status = 0;
            filter_ip = 0;
            filter_agent = 0;
            filter_url = 0;
            passed = 0;
            lines_processed = 0;
            
            print "TIMER:begin_processing_start" > "/dev/stderr";
            fflush("/dev/stderr");
        }
        {
            # CloudFront log fields (tab-delimited):
            # 1=date 2=time 3=x-edge-location 4=sc-bytes 5=c-ip 6=cs-method 
            # 7=cs(Host) 8=cs-uri-stem 9=sc-status 10=cs(Referer) 11=cs(User-Agent) 
            # 12=cs-uri-query 13=cs(Cookie) 14=x-edge-result-type 15=x-edge-request-id
            
            lines_processed++;
            
            ip = $5;           # c-ip
            method = $6;       # cs-method
            uri = $8;          # cs-uri-stem
            status = $9;       # sc-status
            useragent = $11;   # cs(User-Agent) - URL encoded
            
            # Filter 1: Must have browser user-agent signatures
            if (useragent !~ /Mozilla\/5\.0|AppleWebKit|Chrome|Safari|Firefox|Edge|Opera/) { filter_browser++; next; }
            
            # Filter 2: Must be GET request
            if (method !~ /GET/) { filter_method++; next; }
            
            # Filter 3: Exclude 301 redirects
            if (status ~ /301/) { filter_status++; next; }
            
            # Filter 4: Check if IP is blocked (O(1) hash lookup)
            if (ip in blocked_ips) { filter_ip++; next; }
            
            # Filter 5: Check user-agent patterns (case-insensitive)
            useragent_lower = tolower(useragent);
            for (i = 1; i <= agent_count; i++) {
                if (useragent_lower ~ agent_patterns[i]) { filter_agent++; next; }
            }
            
            # Filter 6: Check URL patterns (case-insensitive)
            uri_lower = tolower(uri);
            for (i = 1; i <= url_count; i++) {
                if (uri_lower ~ url_patterns[i]) { filter_url++; next; }
            }
            
            # Line passed all filters
            passed++;
            print $0;
        }
        END {
            print "TIMER:processing_end:" lines_processed ":" passed ":" filter_browser ":" filter_method ":" filter_status ":" filter_ip ":" filter_agent ":" filter_url > "/dev/stderr";
            fflush("/dev/stderr");
        }
        '
        
        timer_end=$(date +%s%N)
        timer_elapsed=$(( (timer_end - timer_start) / 1000000 ))
        [[ -z "$flag_verbose" ]] || { echo "  [TIMER] Awk script built in ${timer_elapsed}ms"; }
        

        for ((i = $diff_days; i > 0; i--)); do
            target_date=$(date -v-$i"d" -j -f %Y%m%d $stop_date +%Y-%m)

            if [[ $target_date != $last_date ]]; then
                [[ -z "$flag_verbose" ]] || { echo "Cleaning $target_date"; }
                
                # Run awk with stderr captured to display timing
                timer_start=$(date +%s%N)
                awk "$awk_script" "$BASE/logs/log_raw_$target_date" 2>/dev/null > "$BASE/logs/log_clean_$target_date"
                timer_end=$(date +%s%N)
                timer_elapsed=$(( (timer_end - timer_start) / 1000000 ))
                
                # Display timing info if verbose
                if [[ -n "$flag_verbose" ]]; then
                    echo "  [TIMER] Processing $target_date: ${timer_elapsed}ms"
                fi
                
                last_date=$target_date;
            fi
        done

        [[ -z "$flag_verbose" ]] || { echo "Concatenating 2024 clean"; }
        timer_start=$(date +%s%N)
        zcat -f $BASE/logs/log_clean_2024-* > $BASE/logs/log_clean;
        timer_end=$(date +%s%N)
        timer_elapsed=$(( (timer_end - timer_start) / 1000000 ))
        [[ -z "$flag_verbose" ]] || { echo "  [TIMER] 2024 concatenation: ${timer_elapsed}ms"; }
        
        [[ -z "$flag_verbose" ]] || { echo "Concatenating 2025 clean"; }
        timer_start=$(date +%s%N)
        zcat -f $BASE/logs/log_clean_2025-* >> $BASE/logs/log_clean;
        timer_end=$(date +%s%N)
        timer_elapsed=$(( (timer_end - timer_start) / 1000000 ))
        [[ -z "$flag_verbose" ]] || { echo "  [TIMER] 2025 concatenation: ${timer_elapsed}ms"; }
    fi

    return true;
}

function analyze () {

    echo "========================================";
    echo "ANALYZING DATA";
    [[ -z "$flag_verbose" ]] || { echo "----------------------------------------";}
    [[ -z "$flag_verbose" ]] || { echo "GoAccess options: $goaccess_opt";}
    [[ -z "$flag_verbose" ]] || { echo "----------------------------------------";}

    local diff_days=$(((stop_seconds - start_seconds) / 86400))
    local last_date="";
    
    # Build goaccess command with GeoIP if available (for per-month file analysis)
    local goaccess_file_opts="$goaccess_opt"
    if [[ -n "$GEOIP_DB" ]]; then
        goaccess_file_opts+="--geoip-database='$GEOIP_DB' "
    fi
    
    for ((i = $diff_days; i > 0; i--)); do

        target_date=$(date -v-$i"d" -j -f %Y%m%d $stop_date +%Y-%m)

        if [[ $target_date != $last_date ]]; then

            if (( $#flag_raw )); then
                # raw logs
                [[ -z "$flag_verbose" ]] || { echo "Analyzing $target_date RAW"; }
                goaccess_cmd="goaccess $BASE/logs/log_raw_$target_date -o $BASE/www/$target_date-raw.html ";
            else
                # clean logs
                [[ -z "$flag_verbose" ]] || { echo "Analyzing $target_date CLEAN"; }
                goaccess_cmd="goaccess $BASE/logs/log_clean_$target_date -o $BASE/www/$target_date.html ";
            fi

            goaccess_cmd+="$goaccess_file_opts";
            eval ${goaccess_cmd}

            last_date=$target_date;
        fi

    done

    # Build stdin options array (avoids shell quoting issues)
    local -a stdin_opts
    stdin_opts=(
        --date-format='%Y-%m-%d'
        --time-format='%H:%M:%S'
        --log-format='%d	%t	%^	%^	%h	%m	%v	%U	%s	%R	%u	%q	%C	%^	%^'
        --no-query-string
        --agent-list
        --ignore-crawlers
        --unknowns-as-crawlers
        --tz='America/New_York'
    )
    
    if [[ -n "$GEOIP_DB" ]]; then
        stdin_opts+=(--geoip-database="$GEOIP_DB")
    fi
    
    if [[ -z "$flag_verbose" ]]; then
        stdin_opts+=(--no-progress)
    fi

    periods_opt=('7d' '14d' '30d' '90d' '365d')
    for duration in $periods_opt
    do
        [[ -z "$flag_verbose" ]] || { echo "Analyzing -$duration";}
        
        # Calculate start date for this period (YYYY-MM-DD format for awk comparison)
        local period_start=$(date -v-$duration +%Y-%m-%d)
        local period_end=$(date -v+1d +%Y-%m-%d)
        
        if (( $#flag_raw )); then
            # For raw logs - filter by date with awk, pipe to GoAccess
            awk -F'\t' -v start="$period_start" -v end="$period_end" \
                '$1 >= start && $1 < end {print}' \
                "$BASE/logs/log_raw" | \
                goaccess -a -o "$BASE/www/l$duration-raw.html" "${stdin_opts[@]}"
        else
            # For clean logs - filter by date with awk, pipe to GoAccess
            awk -F'\t' -v start="$period_start" -v end="$period_end" \
                '$1 >= start && $1 < end {print}' \
                "$BASE/logs/log_clean" | \
                goaccess -a -o "$BASE/www/l$duration.html" "${stdin_opts[@]}"
        fi
    done

    if [[ "$arg_duration[-1]" = "all" ]]; then
        [[ -z "$flag_verbose" ]] || { echo "Analyzing 2024";}
        if (( $#flag_raw )); then
            zcat -f $BASE/logs/log_raw_2024-* | goaccess -o $BASE'/../metrics/www/2024-raw.html' $goaccess_file_opts
        else
            zcat -f $BASE/logs/log_clean_2024-* | goaccess -o $BASE'/../metrics/www/2024.html' $goaccess_file_opts
        fi
    fi

    return 1;
}

function analyze-range () {

	echo "========================================";
	echo "ANALYZING RANGE $start_date-$stop_date";
	[[ -z "$flag_verbose" ]] || { echo "----------------------------------------";}

	sed_cmd="sed -n '" \
	sed_cmd+="/'$(date -j -f %Y%m%d $start_date +%Y)'\-'$(date -j -f %Y%m%d $start_date +%m)'\-'$(date -j -f %Y%m%d $start_date +%d)'/"
	filename="$start_date";
	if [[ $start_date != $stop_date ]]; then
		sed_cmd+=",/'$(date -j -v+1d -f %Y%m%d $stop_date +%Y)'\-'$(date -j -v+1d -f %Y%m%d $stop_date +%m)'\-'$(date -j -v+1d -f %Y%m%d $stop_date +%d)'/"
		filename+="-$stop_date";
	fi
	if (( $#flag_raw )); then
		filename+="-raw"
		sed_cmd+=" p' $BASE/logs/log_raw"
	else
		sed_cmd+=" p' $BASE/logs/log_clean"
	fi
	sed_cmd+=" | goaccess -a -o $BASE/../metrics/www/$filename.html "
	sed_cmd+="$goaccess_opt";

	[[ -z "$flag_verbose" ]] || { 
		echo $sed_cmd;
	}
	eval ${sed_cmd}
	return 1;
}

function investigate () {

	echo "========================================";
	echo "INVESTIGATING AN IP";
	[[ -z "$flag_verbose" ]] || { 
		echo "----------------------------------------";
	}

	duration='30d';
	the_cmd="sed -n '/'$(date -v-$duration +%Y-%m-%d)'/,/$(date -v+1d +%Y-%m-%d)/ p' $BASE/logs/log_raw"

	# the_cmd="cat ";
	# the_cmd+=$BASE'/logs/log_raw_2024-12';
	the_cmd+=" | grep "$arg_ipmask[-1];
	# the_cmd+=" | grep -vi optimized";
	the_cmd+=" > "$BASE"/logs/investigation.log;";

	[[ -z "$flag_verbose" ]] || { 
		echo $the_cmd;
	}

	eval ${the_cmd};
}

function update_blacklists () {

	echo "========================================";
	echo "UPDATING BLACKLISTS";
	echo "========================================";

	# Create external directory if it doesn't exist
	mkdir -p "$BASE/_external"

	# Backup existing blacklists
	echo "Backing up existing blacklists...";
	mkdir -p "$BASE/blacklists"
	if [ -f "$BASE/blacklists/blacklist-agents.txt" ]; then
		cp "$BASE/blacklists/blacklist-agents.txt" "$BASE/blacklists/blacklist-agents.txt.bak-$(date +%Y%m%d-%H%M%S)"
	fi
	if [ -f "$BASE/blacklists/blacklist-urls.txt" ]; then
		cp "$BASE/blacklists/blacklist-urls.txt" "$BASE/blacklists/blacklist-urls.txt.bak-$(date +%Y%m%d-%H%M%S)"
	fi

	echo "----------------------------------------";
	echo "Fetching external lists...";

	# Fetch FireHOL Level 1 IPs (aggregated malicious IPs)
	echo "  - FireHOL Level 1 IP blocklist";
	curl -fsSL "https://iplists.firehol.org/files/firehol_level1.netset" \
		-o "$BASE/_external/firehol_level1.netset" 2>/dev/null

	# Fetch CrowdSec community blocklist
	echo "  - CrowdSec community blocklist";
	curl -fsSL "https://blocklist-de.security.fc00.de/" \
		-o "$BASE/_external/crowdsec_blocklist.txt" 2>/dev/null

	# Fetch GitHub crawler user-agents list
	echo "  - GitHub crawler-user-agents";
	curl -fsSL "https://raw.githubusercontent.com/monperrus/crawler-user-agents/master/crawler-user-agents.json" \
		-o "$BASE/_external/crawler-user-agents.json" 2>/dev/null

	echo "----------------------------------------";
	echo "Processing and merging lists...";

	# Process IPs from FireHOL (strip comments, keep IPs - no escaping for -F matching)
	if [ -f "$BASE/_external/firehol_level1.netset" ]; then
		grep -v '^#' "$BASE/_external/firehol_level1.netset" | \
			grep -E '^[0-9]' > "$BASE/_external/firehol_ips.txt" 2>/dev/null
		echo "  ✓ FireHOL: $(wc -l < $BASE/_external/firehol_ips.txt 2>/dev/null || echo 0) IPs"
	fi

	# Process CrowdSec IPs (no escaping for -F matching)
	if [ -f "$BASE/_external/crowdsec_blocklist.txt" ]; then
		grep -E '^[0-9]' "$BASE/_external/crowdsec_blocklist.txt" > "$BASE/_external/crowdsec_ips.txt" 2>/dev/null
		echo "  ✓ CrowdSec: $(wc -l < $BASE/_external/crowdsec_ips.txt 2>/dev/null || echo 0) IPs"
	fi

	# Process crawler user-agents from JSON
	if [ -f "$BASE/_external/crawler-user-agents.json" ]; then
		# Extract patterns from JSON (simple grep approach for compatibility)
		grep -oE '"pattern"\s*:\s*"[^"]+"' "$BASE/_external/crawler-user-agents.json" | \
			cut -d'"' -f4 > "$BASE/_external/crawler_agents.txt" 2>/dev/null
		echo "  ✓ Crawlers: $(wc -l < $BASE/_external/crawler_agents.txt 2>/dev/null || echo 0) user agents"
	fi

	echo "----------------------------------------";
	echo "Merging with existing blacklists...";

	# Create separate blacklist-ips.txt for IP blocklists (don't mix with UA patterns)
	if [ -f "$BASE/_external/firehol_ips.txt" ] || [ -f "$BASE/_external/crowdsec_ips.txt" ]; then
		# Start fresh or backup existing
		if [ -f "$BASE/blacklists/blacklist-ips.txt" ]; then
			cp "$BASE/blacklists/blacklist-ips.txt" "$BASE/blacklists/blacklist-ips.txt.bak-$(date +%Y%m%d-%H%M%S)"
		fi
		
		echo "# Auto-updated IP blocklists ($(date +%Y-%m-%d))" > "$BASE/blacklists/blacklist-ips.txt"
		echo "# Plain text IPs for fast -F (fixed string) matching" >> "$BASE/blacklists/blacklist-ips.txt"
		
		if [ -f "$BASE/_external/firehol_ips.txt" ]; then
			cat "$BASE/_external/firehol_ips.txt" >> "$BASE/blacklists/blacklist-ips.txt"
		fi
		
		if [ -f "$BASE/_external/crowdsec_ips.txt" ]; then
			cat "$BASE/_external/crowdsec_ips.txt" >> "$BASE/blacklists/blacklist-ips.txt"
		fi
		
		# Deduplicate and sort
		sort -u "$BASE/blacklists/blacklist-ips.txt" > "$BASE/blacklists/blacklist-ips.txt.tmp"
		mv "$BASE/blacklists/blacklist-ips.txt.tmp" "$BASE/blacklists/blacklist-ips.txt"
	fi

	# Merge crawler UAs into blacklist-agents.txt (user-agent patterns only)
	if [ -f "$BASE/_external/crawler_agents.txt" ]; then
		echo "" >> "$BASE/blacklists/blacklist-agents.txt"
		echo "# Auto-updated crawler user agents ($(date +%Y-%m-%d))" >> "$BASE/blacklists/blacklist-agents.txt"
		cat "$BASE/_external/crawler_agents.txt" >> "$BASE/blacklists/blacklist-agents.txt"
		
		# Deduplicate and sort blacklist-agents.txt
		sort -u "$BASE/blacklists/blacklist-agents.txt" > "$BASE/blacklists/blacklist-agents.txt.tmp"
		mv "$BASE/blacklists/blacklist-agents.txt.tmp" "$BASE/blacklists/blacklist-agents.txt"
	fi

	echo "========================================";
	echo "Blacklists updated successfully!";
	echo "  - blacklist-agents.txt: $(wc -l < $BASE/blacklists/blacklist-agents.txt) entries (user agents & patterns)";
	echo "  - blacklist-ips.txt: $(wc -l < $BASE/blacklists/blacklist-ips.txt 2>/dev/null || echo 0) entries (IP addresses)";
	echo "  - blacklist-urls.txt: $(wc -l < $BASE/blacklists/blacklist-urls.txt) entries (URL patterns)";
	echo "  - Backups saved with timestamp";
	echo "========================================";
}

# ==================================================
# PARSE INPUTS
# ==================================================
zmodload zsh/zutil
zparseopts -D -F -K -- \
{h,-help}=flag_help \
{s,-skip-download}=flag_skipdownload \
{F,-skip-filter}=flag_skipfilter \
{r,-raw}=flag_raw \
{v,-verbose}=flag_verbose \
{b,-update-blacklists}=flag_update_blacklists \
{i,-ip}:=arg_ipmask \
{t,-term}:=arg_duration \
{f,-from}:=arg_start_date \
{u,-until}:=arg_stop_date ||
return 1

[[ -z "$flag_help" ]] || { print -l $usage && return }

if [[ "$arg_start_date[-1]" ]]; then
	start_date=$(date -j -f %Y%m%d $arg_start_date[-1] +%Y%m%d);
	start_day=$(date -j -f %Y%m%d $start_date +%d);
	start_month=$(date -j -f %Y%m%d $start_date +%m);
	start_seconds=$(date -j -f %Y%m%d $start_date +%s);
fi

if [[ "$arg_stop_date[-1]" ]]; then
	stop_date=$(date -j -f %Y%m%d $arg_stop_date[-1] +%Y%m%d);
	stop_day=$(date -j -f %Y%m%d $arg_stop_date[-1] +%d);
	stop_month=$(date -j -f %Y%m%d $arg_stop_date[-1] +%m);
	stop_seconds=$(date -j -f %Y%m%d $arg_stop_date[-1] +%s);
fi

if [[ "$arg_duration[-1]" = "all" ]]; then
	start_date=$(date +%Y)"0101";
	start_day=$(date -j -f %Y%m%d $start_date +%d);
	start_month=$(date -j -f %Y%m%d $start_date +%m);
	start_seconds=$(date -j -f %Y%m%d $start_date +%s);
fi

if (( $#flag_verbose )); then
	goaccess_opt+="";
else
	goaccess_opt+=" --no-progress ";
fi


# ==================================================
# RUN ACTIONS
# ==================================================

if [[ "$flag_update_blacklists" ]]; then
	update_blacklists;
	exit;
fi

if [[ "$arg_ipmask[-1]" ]]; then
	investigate;
	exit;
fi

echo "========================================";
echo "LOG ANALYSIS";
[[ -z "$flag_verbose" ]] || { echo "----------------------------------------";}
[[ -z "$flag_verbose" ]] || { 
	echo "TIMEFRAME: $start_date – $stop_date";
}

download;

parse;

if [[ "$arg_start_date[-1]" && "$arg_stop_date[-1]" ]]; then
	analyze-range;
else
	analyze;
fi


echo "========================================";
echo "LOG ANALYSIS COMPLETE";

exit 1;