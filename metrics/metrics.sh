#!/bin/zsh

BASE=$(dirname "$0");

start_date=$(date -v-300d +%Y%m%d);
start_day=$(date -j -f %Y%m%d $start_date +%d);
start_month=$(date -j -f %Y%m%d $start_date +%m);
start_seconds=$(date -j -f %Y%m%d $start_date +%s)

stop_date=$(date +%Y%m%d);
stop_day=$(date -j -f %Y%m%d $stop_date +%d);
stop_month=$(date -j -f %Y%m%d $stop_date +%m);
stop_seconds=$(date -j -f %Y%m%d $stop_date +%s)

local flag_skipdownload flag_verbose flag_help flag_raw
local usage=(
"metrics.sh [-h|--help]"
"metrics-sh [-v|--verbose] [-s|--skipdownload] [-r|--raw] [-f|--from=<start-date>] [-u|--until=<stop-date>] [-t|--term=<duration>] [-i|--ip=ip.to.investigate]"
)

goaccess_opt="--no-progress "
goaccess_opt+="--log-format=CLOUDFRONT "
goaccess_opt+="--no-query-string "
goaccess_opt+="--agent-list "
goaccess_opt+="--ignore-crawlers "
goaccess_opt+="--unknowns-as-crawlers "
goaccess_opt+="--tz='America/New York' "
goaccess_opt+="--geoip-database=/Users/brianmcconnell/Downloads/GeoLite2-City/GeoLite2-City.mmdb"


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
	echo "DOWNLOADING DATA";
	[[ -z "$flag_verbose" ]] || { echo "----------------------------------------";}

	if (( $#flag_verbose )); then
		echo "Downloading from s3://brianmcconnell.me"
		aws s3 sync s3://brianmcconnell.me $BASE/downloads
	else
		aws s3 sync s3://brianmcconnell.me $BASE/downloads --quiet
	fi

	# [[ -z "$flag_verbose" ]] || { echo "Unzipping Logs"; }
	tempstartmonth=$start_month;
	if [[ "$arg_duration[-1]" != "all" ]]; then
		tempstartmonth=$stop_month;
	fi

	#NOTE: you can't unzip all files for a year so we go month by month
	#gunzip -c -k -f $BASE'/downloads/E1TNSK7JF24IAY.2024-0'* | grep  -E -v -i -f ../blacklist.txt | goaccess  -o ../www/2024.html --log-format=CLOUDFRONT --no-query-string --agent-list --ignore-crawlers --unknowns-as-crawlers --tz="America/New York"
	#zcat -f logs/log_clean0* 

    local diff_days=$(((stop_seconds - start_seconds) / 86400))
	local last_date="";

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
	echo "========================================";
	echo "PREPARING DATA" $1;
	[[ -z "$flag_verbose" ]] || { echo "----------------------------------------";}


	if (( $#flag_raw )); then
		# [[ -z "$flag_verbose" ]] || { echo "Concatenating 2024 raw"; }
		# zcat -f $BASE/logs/log_raw_2024-* > $BASE/logs/log_raw;
		return true;
	else
	    local diff_days=$(((stop_seconds - start_seconds) / 86400))
		local last_date="";

		for ((i = $diff_days; i > 0; i--)); do

		    target_date=$(date -v-$i"d" -j -f %Y%m%d $stop_date +%Y-%m)

		    if [[ $target_date != $last_date ]]; then
		    
				[[ -z "$flag_verbose" ]] || { echo "Cleaning $target_date"; }
				cat  $BASE'/logs/log_raw_'$target_date |\
				grep -E -v -i -f $BASE/blacklist-agents.txt |\
				grep -E -v -i -f $BASE/blacklist-urls.txt\
				> $BASE'/logs/log_clean_'$target_date

				last_date=$target_date;
			fi

		done

		[[ -z "$flag_verbose" ]] || { echo "Concatenating 2024 clean"; }
		zcat -f $BASE/logs/log_clean_2024-* > $BASE/logs/log_clean;
		zcat -f $BASE/logs/log_clean_2025-* >> $BASE/logs/log_clean;
	fi

}


function analyze () {

	echo "========================================";
	echo "ANALYZING DATA";
	[[ -z "$flag_verbose" ]] || { 
		echo "----------------------------------------";
	}
	if [[ "$arg_start_date[-1]" && "$arg_stop_date[-1]" ]]; then
		analyze-range;
		return 1;
	fi


    local diff_days=$(((stop_seconds - start_seconds) / 86400))
	local last_date="";
	for ((i = $diff_days; i > 0; i--)); do

	    target_date=$(date -v-$i"d" -j -f %Y%m%d $stop_date +%Y-%m)

	    if [[ $target_date != $last_date ]]; then
	    

			if (( $#flag_raw )); then
				# raw logs
				[[ -z "$flag_verbose" ]] || { echo "Analyzing 2024-$i RAW"; }
				goaccess_cmd="goaccess $BASE/logs/log_raw_$target_date -o $BASE/www/$target_date-raw.html ";
			else
				# clean logs
				[[ -z "$flag_verbose" ]] || { echo "Analyzing 2024-$i CLEAN"; }
				goaccess_cmd="goaccess $BASE/logs/log_clean_$target_date -o $BASE/www/$target_date.html ";
			fi

			goaccess_cmd+="$goaccess_opt";
			eval ${goaccess_cmd}


			last_date=$target_date;
		fi

	done


	periods_opt=('7d' '30d' '90d')
	for duration in $periods_opt
	do
		if (( $#flag_raw )); then
			[[ -z "$flag_verbose" ]] || { echo "Analyzing -$duration RAW";}
			sed_cmd="sed -n '/'$(date -v-$duration +%Y-%m-%d)'/,/$(date -v+1d +%Y-%m-%d)/ p' $BASE/logs/log_raw | goaccess -a -o $BASE/../metrics/www/l$duration-raw.html $goaccess_opt";
		else
			[[ -z "$flag_verbose" ]] || { echo "Analyzing -$duration CLEAN";}
			sed_cmd="sed -n '/$(date -v-$duration +%Y-%m-%d)/,/$(date -v+1d +%Y-%m-%d)/ p' $BASE/logs/log_clean | goaccess -a -o $BASE/../metrics/www/l$duration.html $goaccess_opt";
		fi
		eval ${sed_cmd}
	done

	if [[ "$arg_duration[-1]" = "all" ]]; then
		[[ -z "$flag_verbose" ]] || { echo "Analyzing 2024";}
		sed_cmd="zcat -f $BASE/logs/log_clean_2024-* | goaccess  -o $BASE'/../metrics/www/2024.html' $goaccess_opt";
		eval ${sed_cmd}
	fi

	return 1;
}

function analyze-range () {

	echo "Analyzing $start_date-$stop_date";

	sed_cmd="sed -n '" \
	sed_cmd+="/2024\-'$(date -j -f %Y%m%d $start_date +%m)'\-'$(date -j -f %Y%m%d $start_date +%d)'/"
	filename="$start_date";
	if [[ $start_date != $stop_date ]]; then
		sed_cmd+=",/2024\-'$(date -j -v+1d -f %Y%m%d $stop_date +%m)'\-'$(date -j -v+1d -f %Y%m%d $stop_date +%d)'/"
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

# ==================================================
# PARSE INPUTS
# ==================================================
zmodload zsh/zutil
zparseopts -D -F -K -- \
{h,-help}=flag_help \
{s,-skipdownload}=flag_skipdownload \
{r,-raw}=flag_raw \
{v,-verbose}=flag_verbose \
{i,-ip}:=arg_ipmask \
{t,-term}:=arg_duration \
{f,-from}:=arg_start_date \
{u,-until}:=arg_stop_date ||
return 1

[[ -z "$flag_help" ]] || { print -l $usage && return }
# [[ -z "$flag_verbose" ]] || { print "verbose mode" }

if [[ "$arg_start_date[-1]" ]]; then
	start_date=$(date -j -f %Y%m%d $arg_start_date[-1] +%Y%m%d);
	start_day=$(date -j -f %Y%m%d $start_date +%d);
	start_month=$(date -j -f %Y%m%d $start_date +%m);
	start_seconds=$(date -j -f %Y%m%d $start_date +%s);
fi

if [[ "$arg_stop_date[-1]" ]]; then
	stop_date=$(date -j -f %Y%m%d $arg_stop_date[-1] +%Y%m%d);
	stop_day=$(date -j -f %Y%m%d $stop_date +%d);
	stop_month=$(date -j -f %Y%m%d $stop_date +%m);
	stop_seconds=$(date -j -f %Y%m%d $stop_date +%s);
fi

if [[ "$arg_duration[-1]" = "all" ]]; then
	start_date=$(date +%Y)"0101";
	start_day=$(date -j -f %Y%m%d $start_date +%d);
	start_month=$(date -j -f %Y%m%d $start_date +%m);
	start_seconds=$(date -j -f %Y%m%d $start_date +%s);
fi

# ==================================================
# RUN ACTIONS
# ==================================================

if [[ "$arg_ipmask[-1]" ]]; then
	investigate;
	exit;
fi

echo "========================================";
echo "LOG ANALYSIS";
[[ -z "$flag_verbose" ]] || { 
	echo "----------------------------------------";
}
[[ -z "$flag_verbose" ]] || { 
	echo "TIMEFRAME: $start_date – $stop_date";
}

download;

parse;

analyze;

echo "========================================";
echo "LOG ANALYSIS COMPLETE";

exit 1;