#!/bin/zsh
SRC="$(dirname "$0")/src";
OUT="$(dirname "$0")/www";
S3BUCKET="www.brianmcconnell.me"
CLOUDFRONT="E1TNSK7JF24IAY";

NOCOLOR='\033[0m';
Black='\033[1;30m';
Red='\033[1;31m';
YELLOW='\033[1;33m';
Blue='\033[1;34m';
PURPLE='\033[1;35m';
CYAN='\033[1;36m';
GRAY='\033[1;37m';

function build_js () {
	echo "${YELLOW}---------------------------------------------";
	echo "- COMPILING JAVASCRIPT";
	echo "---------------------------------------------${GRAY}";

	if [ ! -d "$OUT/js" ]; then
		mkdir -m755 -p $OUT/js;
	fi;

	echo " Gradient JS";
	uglifyjs -m \
		-c sequences=true,dead_code,conditionals,booleans,unused,if_return,join_vars \
		--source-map url=gradient.js.map \
		-o $OUT/js/gradient.js \
		$SRC/_js/gradient.js;

	# echo " home JS";
	# mkdir -m755 -p $OUT/js;
	# uglifyjs -m \
	# 	-c sequences=true,dead_code,conditionals,booleans,unused,if_return,join_vars \
	# 	--source-map url=home.js.map \
	# 	-o $OUT/js/home.js \
	# 	$SRC/_js/home.js;

	echo " Photos JS";
	uglifyjs -m -c sequences=true,dead_code,conditionals,booleans,unused,if_return,join_vars \
		 --source-map url=photos.js.map \
		-o $OUT/js/photos.js \
		$SRC/_js/photos.js;

	echo " Portfolio JS";
	uglifyjs -m -c sequences=true,dead_code,conditionals,booleans,unused,if_return,join_vars \
		 --source-map url=portfolio.js.map \
		-o $OUT/js/portfolio.js \
		$SRC/_js/gallery-inline.js $SRC/_js/portfolio.js;

	echo " Boids JS";
	uglifyjs -m -c sequences=true,dead_code,conditionals,booleans,unused,if_return,join_vars \
		 --source-map url=boids.js.map \
		-o $OUT/js/boids.js \
		$SRC/_js/boids.js;

	echo " AI Boids JS";
	uglifyjs -m -c sequences=true,dead_code,conditionals,booleans,unused,if_return,join_vars \
		 --source-map url=boids.js.map \
		-o $OUT/js/aiboids.js \
		$SRC/_js/aiboids.js;

	echo " Life JS";
	uglifyjs -m -c sequences=true,dead_code,conditionals,booleans,unused,if_return,join_vars \
		 --source-map url=life.js.map \
		-o $OUT/js/life.js \
		$SRC/_js/life.js;

	# echo " Wind JS";
	# uglifyjs -m -c sequences=true,dead_code,conditionals,booleans,unused,if_return,join_vars \
	# 	 --source-map url=wind.js.map \
	# 	-o $OUT/js/wind.js \
	# 	$SRC/_js/wind.js;

	# echo " smoke JS";
	# uglifyjs -m -c sequences=true,dead_code,conditionals,booleans,unused,if_return,join_vars \
	# 	 --source-map url=smoke.js.map \
	# 	-o $OUT/js/smoke.js \
	# 	$SRC/_js/smoke.js;

	# echo " BoidsGL JS";
	# uglifyjs -m -c sequences=true,dead_code,conditionals,booleans,unused,if_return,join_vars \
	# 	 --source-map url=boidsgl.js.map \
	# 	-o $OUT/js/boidsgl.js \
	# 	$SRC/_js/boidsgl.js;

	# cp $SRC/_js/init-buffers.js $OUT/js/init-buffers.js;
	# cp $SRC/_js/draw-scene.js $OUT/js/draw-scene.js;

	echo "SPARKY";
	uglifyjs -m \
		-c sequences=true,dead_code,conditionals,booleans,unused,if_return,join_vars \
		--source-map url=sparky.js.map \
		-o $OUT/js/sparky.js \
		$SRC/_js/sparky.js;# $SRC/_js/getLayer.js $SRC/_js/getParticleSystem.js;

	echo "COPY THREE"
	cp $SRC/_js/getLayer.js $SRC/_js/getParticleSystem.js $OUT/js;

	echo " Main JS";
	mkdir -m755 -p $OUT/js;
	uglifyjs -m \
		-c sequences=true,dead_code,conditionals,booleans,unused,if_return,join_vars \
		--source-map url=mrbmc.js.map \
		-o $OUT/js/mrbmc.js \
		$SRC/_js/mrbmc.js;

	echo "${NOCOLOR}";

}

function build_thumbs () {
	echo "Build Thumbnails";

	for entry in "$SRC/_images/blog"/*
	do
		if [ -f "$entry" ] && [[ $entry != *"thumb"* ]] && [[ $entry != *"mp4"* ]];then
			thumb=${entry//(\.jpg|\.jpeg|\.png|\.webp)/"-thumb.jpg"};
			if [ ! -f "$thumb" ];then
				echo "converting $entry";
				convert -quality 30 -format JPEG -resize 512 $entry $thumb;
			fi
		fi
	done

}

function build_assets () {

	echo "${YELLOW}---------------------------------------------";
	echo "- DEPLOYING STATIC ASSETS";
	echo "---------------------------------------------${NOCOLOR}";

	# echo "${YELLOW}- Deploy fonts";
	# echo "---------------------------------------------${NOCOLOR}";
	# rsync -av --delete-after $SRC/_fonts/ $OUT/css/fonts;

	# build_thumbs;

	echo "${YELLOW}---------------------------------------------";
	echo "- Deploy images";
	echo "---------------------------------------------${NOCOLOR}";
	rsync -av --exclude 'portfolio' $SRC/images/ $OUT/images;


	echo "${YELLOW}---------------------------------------------";
	echo "- Sync old versions";
	echo "---------------------------------------------${GRAY}";
	rsync -av $(dirname "$0")/backup/1999/ $OUT/1999;
	rsync -av $(dirname "$0")/backup/2000/ $OUT/2000;
	rsync -av $(dirname "$0")/backup/2001/ $OUT/2001;
	rsync -av $(dirname "$0")/backup/2001/ $OUT/2002;
	rsync -av $(dirname "$0")/backup/2001/ $OUT/2015;
	rsync -av $(dirname "$0")/backup/2022/ $OUT/2022;
	rsync -av $(dirname "$0")/backup/2023/www/ $OUT/2023;
	echo "${NOCOLOR}";

}

function build_static () {
	echo "${YELLOW}---------------------------------------------";
	echo "- BUILDING HTML & CSS";
	echo "---------------------------------------------${GRAY}";

	echo "Building CSS..........";
	echo "---------------------------------------------";
	# /opt/homebrew/bin/sass $SRC/_scss/screen.scss $OUT/css/screen.css --style compressed --no-source-map --verbose;
	/opt/homebrew/bin/sass $SRC/_scss:$src/css --style compressed --no-source-map --verbose;

	echo "Building HTML..........";
	echo "---------------------------------------------";
	npx @11ty/eleventy;



}

function build_garbage(){

	echo "${RED}---------------------------------------------";
	echo "GARBAGE COLLECTION${GRAY}";
	find $(dirname "$0") -name ".DS_Store" -type f -delete
	rm -Rf $OUT/*/node_modules; 
	rm -Rf $OUT/metrics; 
	chmod -Rf 755 $OUT/

}


if [[ "$1" == "js" ]]; then

	build_js;

exit;
fi;

if [[ "$1" == "thumbs" ]]; then
	build_thumbs;
exit;
fi;

if [[ "$1" == "assets" ]]; then
	build_assets;
exit;
fi;

if [[ "$1" == "static" ]]; then
	build_static;
exit;
fi;


if [[ "$1" == "backup" ]]; then
	echo "* * * * * * * * * * * * * * * * * * * * * * *";
	echo "Backing up files to gDrive";
	rsync -av ~brianmcconnell/Sites/mrbmc/ --exclude 'metrics/logs/*' ~brianmcconnell/Google\ Drive/My\ Drive/Sites/mrbmc;
	exit;
fi


if [[ "$1" == "deploy" ]]; then

	echo "* * * * * * * * * * * * * * * * * * * * * * *";
	echo "DEPLOY TO AWS";
	echo "* * * * * * * * * * * * * * * * * * * * * * *";
	aws s3 sync $OUT s3://$S3BUCKET --delete

	aws cloudfront  create-invalidation --distribution-id $CLOUDFRONT --paths \
	"/css/*" "/js/*" \
	"/portfolio/*" "/blog/*" "/resume/*" \
	"/about/*" "/gaia/*" "/colophon/*" \
	"/index.html" "/404.html" "/error.html" "/" "/sitemap.xml";
	exit;
fi


if [[ "$1" == "build" ]]; then

	echo "${CYAN}* * * * * * * * * * * * * * * * * * * * * * *";
	echo "* BUILDING mrbmc.com";
	echo "$SRC > $OUT";
	cd "$(dirname "$0")";
	if [ ! -d "$OUT" ]; then
		mkdir -m755 -p $OUT;
	fi;
	echo "${NOCOLOR}";

	build_js;

	build_static;

	build_assets;

	build_garbage;

	echo "${CYAN}* * * * * * * * * * * * * * * * * * * * * * *";
	echo "BUILD COMPLETE";
	echo "* * * * * * * * * * * * * * * * * * * * * * *${NOCOLOR}";

exit;
fi;


echo "We could not execute the '$1' command.";
echo "Available options are 'build', 'js', 'assets', 'thumbs', 'backup', or 'deploy'";

exit;