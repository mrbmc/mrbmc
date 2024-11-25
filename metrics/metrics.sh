#!/bin/zsh

BASE=$(dirname "$0");

startdate=$(date -v-30d +%Y%m%d);
startdateday=$(date -j -f %Y%m%d $startdate +%d);
startdatemonth=$(date -j -f %Y%m%d $startdate +%m);

stopdate=$(date +%Y%m%d);
stopdateday=$(date -j -f %Y%m%d $stopdate +%d);
stopdatemonth=$(date -j -f %Y%m%d $stopdate +%m);

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
	tempstartmonth=$startdatemonth;
	if [[ "$arg_duration[-1]" != "all" ]]; then
		tempstartmonth=$stopdatemonth;
	fi

	#NOTE: you can't unzip all files for a year so we go month by month
	#gunzip -c -k -f $BASE'/downloads/E1TNSK7JF24IAY.2024-0'* | grep  -E -v -i -f ../blacklist.txt | goaccess  -o ../www/2024.html --log-format=CLOUDFRONT --no-query-string --agent-list --ignore-crawlers --unknowns-as-crawlers --tz="America/New York"
	#zcat -f logs/log_clean0* 
	for i in {$tempstartmonth..$stopdatemonth}
	do
		if (( $#flag_verbose )); then
			echo "2024-$i unzipping";
		fi
		gunzip -c -k -f $BASE'/downloads/E1TNSK7JF24IAY.2024-'$i*'gz' > $BASE'/logs/log_raw_2024-'$i
	done
}


function parse () {
	echo "========================================";
	echo "PREPARING DATA" $1;
	[[ -z "$flag_verbose" ]] || { echo "----------------------------------------";}


	tempstartmonth=$startdatemonth;
	# this optimizes parsing by not skipping past month that haven't changed but it's really not needed and messes up the L30 et al
	# if [[ "$arg_duration[-1]" != "all" ]]; then
	# 	tempstartmonth=$stopdatemonth;
	# fi

	if (( $#flag_raw )); then
		[[ -z "$flag_verbose" ]] || { echo "Concatenating 2024 raw"; }
		zcat -f $BASE/logs/log_raw_2024-* > $BASE/logs/log_raw;
		return true;
	else

		for i in {$tempstartmonth..$stopdatemonth}
		do
			[[ -z "$flag_verbose" ]] || { echo "Cleaning 2024-$i"; }
			cat  $BASE'/logs/log_raw_2024-'$i |\
			grep -E -v -i -f $BASE/blacklist-agents.txt |\
			grep -E -v -i -f $BASE/blacklist-urls.txt\
			> $BASE'/logs/log_clean_2024-'$i
		done

		[[ -z "$flag_verbose" ]] || { echo "Concatenating 2024 clean"; }
		zcat -f $BASE/logs/log_clean_2024-* > $BASE/logs/log_clean;
	fi

}


function analyze () {

	echo "========================================";
	echo "ANALYZING DATA";
	[[ -z "$flag_verbose" ]] || { 
		echo "----------------------------------------";
	}
	if [[ "$arg_startdate[-1]" && "$arg_stopdate[-1]" ]]; then
		analyze-range;
		return 1;
	fi


	tempstartmonth=$startdatemonth;

	for i in {$tempstartmonth..$stopdatemonth}
	do

		if (( $#flag_raw )); then
			# raw logs
			[[ -z "$flag_verbose" ]] || { echo "Analyzing 2024-$i RAW"; }
			goaccess_cmd="goaccess $BASE/logs/log_raw_2024-$i -o $BASE/www/2024$i-raw.html ";
		else
			# clean logs
			[[ -z "$flag_verbose" ]] || { echo "Analyzing 2024-$i CLEAN"; }
			goaccess_cmd="goaccess $BASE/logs/log_clean_2024-$i -o $BASE/www/2024$i.html ";
		fi

		goaccess_cmd+="$goaccess_opt";
		eval ${goaccess_cmd}
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

	echo "Analyzing $startdate-$stopdate";

	sed_cmd="sed -n '" \
	sed_cmd+="/2024\-'$(date -j -f %Y%m%d $startdate +%m)'\-'$(date -j -f %Y%m%d $startdate +%d)'/"
	filename="$startdate";
	if [[ $startdate != $stopdate ]]; then
		sed_cmd+=",/2024\-'$(date -j -v+1d -f %Y%m%d $stopdate +%m)'\-'$(date -j -v+1d -f %Y%m%d $stopdate +%d)'/"
		filename+="-$stopdate";
	fi
	sed_cmd+=" p' $BASE/logs/log_clean | goaccess -a -o $BASE/../metrics/www/$filename.html "
	sed_cmd+="$goaccess_opt";
	# echo $sed_cmd;
	eval ${sed_cmd}
	return 1;
}


function investigate () {
	the_cmd="cat ";
	the_cmd+=$BASE'/logs/log_raw_2024-11';
	the_cmd+=" | grep "$arg_ipmask[-1];
	# the_cmd+=" | grep -vi images";
	the_cmd+=" > "$BASE"/logs/investigation.log;";
	# the_cmd+="edit investigation.log";
	# echo $the_cmd;
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
{f,-from}:=arg_startdate \
{u,-until}:=arg_stopdate ||
return 1

[[ -z "$flag_help" ]] || { print -l $usage && return }
# [[ -z "$flag_verbose" ]] || { print "verbose mode" }

if [[ "$arg_startdate[-1]" ]]; then
	startdate=$(date -j -f %Y%m%d $arg_startdate[-1] +%Y%m%d);
	startdateday=$(date -j -f %Y%m%d $startdate +%d);
	startdatemonth=$(date -j -f %Y%m%d $startdate +%m);
fi

if [[ "$arg_stopdate[-1]" ]]; then
	stopdate=$(date -j -f %Y%m%d $arg_stopdate[-1] +%Y%m%d);
	stopdateday=$(date -j -f %Y%m%d $stopdate +%d);
	stopdatemonth=$(date -j -f %Y%m%d $stopdate +%m);
fi

if [[ "$arg_duration[-1]" = "all" ]]; then
	startdate=$(date +%Y)"0101";
	startdateday=$(date -j -f %Y%m%d $startdate +%d);
	startdatemonth=$(date -j -f %Y%m%d $startdate +%m);
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
	echo "TIMEFRAME: $startdate – $stopdate";
}

download;

parse;

analyze;

echo "========================================";
echo "LOG ANALYSIS COMPLETE";

exit 1;