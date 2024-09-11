#!/bin/zsh

BASE=$(dirname "$0");
todate=$(date +%d)
tomonth=$(date +%m)

local flag_skipdownload flag_verbose flag_help 
local arg_term=(all)
local usage=(
"metrics.sh [-h|--help]"
"metrics-sh [-v|--verbose] [-t|--term=<duration>] [<message...>]"
)

local startm=01;
local endm=12;

goaccess_opt="--no-progress --log-format=CLOUDFRONT --no-query-string --agent-list --ignore-crawlers --unknowns-as-crawlers --tz='America/New York'"



zmodload zsh/zutil
zparseopts -D -F -K -- \
{h,-help}=flag_help \
{s,-skipdownload}=flag_skipdownload \
{v,-verbose}=flag_verbose \
{t,-term}:=arg_term ||
return 1

[[ -z "$flag_help" ]] || { print -l $usage && return }
if (( $#flag_verbose )); then
print "verbose mode"
fi

# echo "--verbose: $flag_verbose"
# echo "--skipdownload: $flag_skipdownload"
# echo "--term: $arg_term[-1]"
# echo "positional: $@"



function download () {
	echo "* * * * * * * * * * * * * * * * * *";
	echo "DOWNLOADING DATA";
	echo "* * * * * * * * * * * * * * * * * *";

	echo "DOWNLOADING LOGS FROM S3"
	aws s3 sync s3://brianmcconnell.me $BASE/downloads

	echo "UNZIPPING LOGS"
	for i in {$startm..$endm}
	do
		echo "2024-$i unzipping";
		gunzip -c -k -f $BASE'/downloads/E1TNSK7JF24IAY.2024-'$i*'gz' > $BASE'/logs/log_raw_2024-'$i
	done

}


function parse () {
	echo "* * * * * * * * * * * * * * * * * *";
	echo "PREPARING DATA" $1;
	echo "* * * * * * * * * * * * * * * * * *";

	for i in {$startm..$endm}
	do
		echo "Cleaning 2024-$i";
		grep  -E -v -i -f $BASE/blacklist.txt $BASE'/logs/log_raw_2024-'$i > $BASE'/logs/log_clean_2024-'$i
	done

	echo "Concatenating 2024"
	zcat -f $BASE/logs/log_clean_2024-* > $BASE/logs/log_clean;
}

function analyze () {

	echo "* * * * * * * * * * * * * * * * * *";
	echo "ANALYZING DATA";
	echo "* * * * * * * * * * * * * * * * * *";



	for i in {$startm..$endm}
	do
		# clean logs

		echo "Analyzing 2024-$i";
		goaccess_cmd="goaccess $BASE/logs/log_clean_2024-$i -o $BASE/www/2024$i.html ";
		goaccess_cmd+="$goaccess_opt";
		eval ${goaccess_cmd}

		# raw logs
		goaccess_cmd="goaccess $BASE/logs/log_raw_2024-$i -o $BASE/www/2024$i-raw.html ";
		goaccess_cmd+="$goaccess_opt";
		# eval ${goaccess_cmd}
	done



	periods_opt=('7d' '30d' '90d')
	for n in $periods_opt
	do
		echo "Analyzing -$n";
		sed_cmd="sed -n '/2024\-'$(date -v-$n +%m)'\-'$(date -v-$n +%d)'/,/2024\-'$tomonth'\-'$todate'/ p' $BASE/logs/log_clean | goaccess -a -o $BASE/../metrics/www/l$n.html $goaccess_opt";
		eval ${sed_cmd}
	done

	if [[ "$arg_term[-1]" = "all" ]]; then
		echo "Analyzing 2024";
		sed_cmd="zcat -f $BASE/logs/log_clean_2024-* | goaccess  -o $BASE'/../metrics/www/2024.html' $goaccess_opt";
		eval ${sed_cmd}
	fi

}




# if [ $# -eq 0 ]; then
# 	echo "* * * * * * * * * * * * * * * * * * * * * * *";
#     echo "Please enter a command. Options are 'all', 'process', or 'download'";
# 	exit;
# fi

if [[ "$arg_term[-1]" = "recent" ]]; then
	echo "RECENT ONLY";
	startm=$(date -v-30d +%m);
	endm=$(date +%m);
fi

if (( $#flag_skipdownload )); then
	echo "SKIP DOWNLOAD"
else
	download;
fi

parse;

analyze;




exit;

#NOTE: you can't unzip all files for a year. too many files.
gunzip -c -k -f $BASE'/downloads/E1TNSK7JF24IAY.2024-0'* | grep  -E -v -i -f ../blacklist.txt | goaccess  -o ../www/2024.html --log-format=CLOUDFRONT --no-query-string --agent-list --ignore-crawlers --unknowns-as-crawlers --tz="America/New York"
zcat -f logs/log_clean0* 
