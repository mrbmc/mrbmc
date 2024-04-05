#!/bin/zsh
SRC="$(dirname "$0")/src";
OUT="$(dirname "$0")/www";


function build_js () {
echo "- JAVASCRIPT";

echo " Main JS";
mkdir -m755 -p $OUT/js;
uglifyjs -m \
	-c sequences=true,dead_code,conditionals,booleans,unused,if_return,join_vars \
	--source-map url=mrbmc.min.js.map \
	-o $OUT/js/mrbmc.min.js \
	$SRC/_js/mrbmc.js;

echo " Gradient JS";
mkdir -m755 -p $OUT/js;
uglifyjs -m \
	-c sequences=true,dead_code,conditionals,booleans,unused,if_return,join_vars \
	--source-map url=gradient.min.js.map \
	-o $OUT/js/gradient.min.js \
	$SRC/_js/gradient.js;

echo " home JS";
mkdir -m755 -p $OUT/js;
uglifyjs -m \
	-c sequences=true,dead_code,conditionals,booleans,unused,if_return,join_vars \
	--source-map url=home.min.js.map \
	-o $OUT/js/home.min.js \
	$SRC/_js/home.js;

echo " Photos JS";
uglifyjs -m -c sequences=true,dead_code,conditionals,booleans,unused,if_return,join_vars \
	 --source-map url=photos.min.js.map \
	-o $OUT/js/photos.min.js \
	$SRC/_js/photos.js;

echo " Portfolio JS";
uglifyjs -m -c sequences=true,dead_code,conditionals,booleans,unused,if_return,join_vars \
	 --source-map url=portfolio.min.js.map \
	-o $OUT/js/portfolio.min.js \
	$SRC/_js/gallery-inline.js $SRC/_js/portfolio.js;

echo " Boids JS";
uglifyjs -m -c sequences=true,dead_code,conditionals,booleans,unused,if_return,join_vars \
	 --source-map url=boids.min.js.map \
	-o $OUT/js/boids.min.js \
	$SRC/_js/boids.js;

echo " Contrails JS";
uglifyjs -m -c sequences=true,dead_code,conditionals,booleans,unused,if_return,join_vars \
	 --source-map url=contrails.min.js.map \
	-o $OUT/js/contrails.min.js \
	$SRC/_js/contrails.js;

}

function build_static () {
echo "---------------------------------------------";
echo "- DEPLOYING STATIC ASSETS";

echo "Deploy fonts";
rsync -au --delete-after $SRC/_fonts/ $OUT/css/fonts;

# images are now managed live by 11ty as of 2023-10-24
# but we could still run this as a belt & suspenders approach, and to delete old files.
echo "Deploy images";
rsync -au --delete-after $SRC/_images/ $OUT/images;

}



if [ $# -eq 0 ]; then
	echo "* * * * * * * * * * * * * * * * * * * * * * *";
    echo "Please enter a command. Options are 'build', 'backup', or 'deploy'";
	exit;
fi



if [[ "$1" == "build" ]]; then

echo "* * * * * * * * * * * * * * * * * * * * * * *";
echo "BUILDING mrbmc.com";
echo "$SRC > $OUT";
cd "$(dirname "$0")";
mkdir -m755 -p $OUT;

echo "---------------------------------------------";

# Switched to SCSS as of 2024-01-21
echo "- Compiling SASS";
/opt/homebrew/bin/sass $SRC/_scss/screen.scss $OUT/css/screen.css --style compressed;

# echo "Compiling LESS";
# lessc --source-map-inline --clean-css="--s1 --advanced --compatibility=ie8" $SRC/_less/screen.less $OUT/css/screen.min.css

build_js;

echo "---------------------------------------------";
echo "- BUILDING HTML";
npx @11ty/eleventy --quiet;

build_static;

echo "---------------------------------------------";
echo "GARBAGE COLLECTION";
# rm -Rf $OUT/.DS_Store $OUT/*/.DS_Store; 
find $OUT -name ".DS_Store" -type f -delete
rm -Rf $OUT/*/node_modules; 
chmod -Rf 755 $OUT/

echo "* * * * * * * * * * * * * * * * * * * * * * *";

exit;
fi;


if [[ "$1" == "buildjs" ]]; then

build_js;

exit;
fi;



if [[ "$1" == "backup" ]]; then
	echo "* * * * * * * * * * * * * * * * * * * * * * *";
	echo "Backing up files to gDrive";
	rsync -auv --delete ~brianmcconnell/Sites/mrbmc/ ~brianmcconnell/Google\ Drive/My\ Drive/Sites/mrbmc;
	exit;
fi



if [[ "$1" == "deploy" ]]; then

	echo "* * * * * * * * * * * * * * * * * * * * * * *";
	echo "DEPLOY TO AWS";
	echo "* * * * * * * * * * * * * * * * * * * * * * *";
	aws s3 sync $OUT s3://www.brianmcconnell.me --delete
	aws cloudfront  create-invalidation --distribution-id E1TNSK7JF24IAY --paths \
	"/images/*" "/css/*" "/js/*" \
	"/portfolio/*" "/blog/*" "/resume/*" \
	"/about/*" "/boids/*" "/colophon/*" \
	"/index.html" "/404.html" "/error.html" "/";
	exit;
fi

echo "We could not execute the '$1' command.";
exit;