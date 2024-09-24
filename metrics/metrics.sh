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
"metrics-sh [-v|--verbose] [-s|--skipdownload] [-r|--raw] [-t|--term=<duration>] [<message...>]"
)

goaccess_opt="--no-progress --log-format=CLOUDFRONT --no-query-string --agent-list --ignore-crawlers --unknowns-as-crawlers --tz='America/New York'"


# ==================================================
# FUNCTIONS
# ==================================================


function download () {
	echo "* * * * * * * * * * * * * * * * * *";
	echo "DOWNLOADING DATA";
	echo "* * * * * * * * * * * * * * * * * *";

	echo "DOWNLOADING LOGS FROM S3"
	aws s3 sync s3://brianmcconnell.me $BASE/downloads

	echo "UNZIPPING LOGS"
	for i in {$startdatemonth..$stopdatemonth}
	do
		echo "2024-$i unzipping";
		gunzip -c -k -f $BASE'/downloads/E1TNSK7JF24IAY.2024-'$i*'gz' > $BASE'/logs/log_raw_2024-'$i
	done

}


function parse () {
	echo "* * * * * * * * * * * * * * * * * *";
	echo "PREPARING DATA" $1;
	echo "* * * * * * * * * * * * * * * * * *";


	if (( $#flag_raw )); then
		echo "Concatenating 2024 raw"
		zcat -f $BASE/logs/log_raw_2024-* > $BASE/logs/log_raw;
		return true;
	fi

	for i in {$startdatemonth..$stopdatemonth}
	do
		echo "Cleaning 2024-$i";
		cat  $BASE'/logs/log_raw_2024-'$i |\
		grep -E -v -i -f $BASE/blacklist-agents.txt |\
		grep -E -v -i -f $BASE/blacklist-urls.txt\
		> $BASE'/logs/log_clean_2024-'$i
	done

	echo "Concatenating 2024"
	zcat -f $BASE/logs/log_clean_2024-* > $BASE/logs/log_clean;
}

function analyze () {

	echo "* * * * * * * * * * * * * * * * * *";
	echo "ANALYZING DATA";
	echo "* * * * * * * * * * * * * * * * * *";



	for i in {$startdatemonth..$stopdatemonth}
	do
		echo "Analyzing 2024-$i";

		if (( $#flag_raw )); then
			# raw logs
			goaccess_cmd="goaccess $BASE/logs/log_raw_2024-$i -o $BASE/www/2024$i-raw.html ";
		else
			# clean logs
			goaccess_cmd="goaccess $BASE/logs/log_clean_2024-$i -o $BASE/www/2024$i.html ";
		fi

		goaccess_cmd+="$goaccess_opt";
		eval ${goaccess_cmd}
	done

	periods_opt=('7d' '30d' '90d')
	for duration in $periods_opt
	do
		echo "Analyzing -$duration";
		if (( $#flag_raw )); then
			sed_cmd="sed -n '/2024\-'$(date -v-$duration +%m)'\-'$(date -v-$duration +%d)'/,/2024\-'$stopdatemonth'\-'$stopdateday'/ p' $BASE/logs/log_raw | goaccess -a -o $BASE/../metrics/www/l$duration-raw.html $goaccess_opt";
		else
			sed_cmd="sed -n '/2024\-'$(date -v-$duration +%m)'\-'$(date -v-$duration +%d)'/,/2024\-'$stopdatemonth'\-'$stopdateday'/ p' $BASE/logs/log_clean | goaccess -a -o $BASE/../metrics/www/l$duration.html $goaccess_opt";
		fi
		eval ${sed_cmd}
	done

	if [[ "$arg_duration[-1]" = "all" ]]; then
		echo "Analyzing 2024";
		sed_cmd="zcat -f $BASE/logs/log_clean_2024-* | goaccess  -o $BASE'/../metrics/www/2024.html' $goaccess_opt";
		eval ${sed_cmd}
	fi

	return 1;
}

function parseRange () {
	sed_cmd="sed -n '" \
	sed_cmd+="/2024\-'$(date -j -f %Y%m%d $startdate +%m)'\-'$(date -j -f %Y%m%d $startdate +%d)'/"
	filename="$startdate";
	if [[ $startdate != $stopdate ]]; then
		sed_cmd+=",/2024\-'$(date -j -f %Y%m%d $stopdate +%m)'\-'$(date -j -f %Y%m%d $stopdate +%d)'/"
		filename+="-$stopdate";
	fi
	sed_cmd+=" p' $BASE/logs/log_clean | goaccess -a -o $BASE/../metrics/www/$filename.html "
	sed_cmd+="$goaccess_opt";
	# echo $sed_cmd;
	eval ${sed_cmd}
	return 1;
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
{t,-term}:=arg_duration \
{f,-from}:=arg_startdate \
{u,-until}:=arg_stopdate ||
return 1

[[ -z "$flag_help" ]] || { print -l $usage && return }
[[ -z "$flag_verbose" ]] || { print "verbose mode" && return }

# if [ $# -eq 0 ]; then
# 	echo "* * * * * * * * * * * * * * * * * * * * * * *";
#     echo "Please enter a command. Use -h or --help for options.";
# 	echo "* * * * * * * * * * * * * * * * * * * * * * *";
# 	exit;
# fi
# echo "--verbose: $flag_verbose"
# echo "--skipdownload: $flag_skipdownload"
# echo "--term: $arg_duration[-1]"
# echo "positional: $@"

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
	echo "PROCESS EVERYTHING";
	startdate=20240101;#$(date -v-1y +%Y%m%d);
	startdateday=$(date -j -f %Y%m%d $startdate +%d);
	startdatemonth=$(date -j -f %Y%m%d $startdate +%m);
fi

echo "TIMEFRAME: $startdate – $stopdate";


if [[ "$arg_startdate[-1]" && "$arg_stopdate[-1]" ]]; then
	parseRange;
	exit;
fi

if (( $#flag_skipdownload )); then
	echo "SKIP DOWNLOAD"
else
	download;
fi

parse;

analyze;



#NOTE: you can't unzip all files for a year. too many files.
#gunzip -c -k -f $BASE'/downloads/E1TNSK7JF24IAY.2024-0'* | grep  -E -v -i -f ../blacklist.txt | goaccess  -o ../www/2024.html --log-format=CLOUDFRONT --no-query-string --agent-list --ignore-crawlers --unknowns-as-crawlers --tz="America/New York"
#zcat -f logs/log_clean0* 

exit;