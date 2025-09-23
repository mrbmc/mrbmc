// Get polygon elements
const polygons = document.querySelectorAll('.nav-top svg polygon');
const link = document.querySelectorAll('.nav-top');
const svg = document.querySelectorAll('.nav-top svg');

// Define the animation keyframes for each polygon
const keyframes = [
[
"777.13,117 681.77,472.91 544.7,335.84",
    "292.29,298.41 887.96,298.41 292.29,666.87",
        "90.18,642.26 681.14,276.72 681.14,642.26",
            "334.63,201.88 702.22,227.03 661.57,821.31",
                "583.08,342.46 893.98,850.56 268.79,534.77",
],[
"526,350.84 946.25,773 264.88,610.79",
    "887.96,338.92 887.96,707.37 719.58,434.95",
        "707.4,450.25 1024,642.56 707.4,642.56",
            "719.71,238.64 801.14,291.07 710.23,432.25",
                "616.58,171.66 616.58,222.25 584.6,222.25",
],[
"197.51,409.13 316.24,527.86 247.68,596.36",
    "265.71,297.86 265.71,491.68 179.28,441.82",
        "89.21,665.24 89.21,746.88 140.59,665.24",
            "443.27,539.59 488.09,563.05 405.47,612.69",
                "251.49,557.07 425.25,643 118.66,847.36",
],[
"464.11,677.13 557.24,701.96 478.43,725.64 464.11,677.13",
    "319.8,686.87 319.8,746.57 292.29,702.38",
        "642.88,665.24 674.96,665.24 642.88,715.43",
            "729.12,511.23 743.52,569.23 707.23,533.99",
                "583.99,243.06 751.89,243.06 582.9,339.9",
],[
"181.03,413.79 190.75,443.83 132.99,429.65",
    "113.45,342.92 184.28,384.8 158.43,428.69",
        "0,472.33 168.75,564.59 86.7,614.59",
            "319.54,226.33 498.05,548.66 219.64,392.44",
                "149.9,517.58 226.57,547.48 208.15,594.96",
]
];

// const polyColors = [
//     "#C00","#0C0","#00C","#C90","#09C"
// ]

// Function to parse polygon points string into array of coordinates
function parsePoints(pointsString) {
    return pointsString.trim().split(/\s+/).map(point => {
        const [x, y] = point.split(',').map(Number);
        return { x, y };
    });
}

// Function to interpolate between two sets of points
function interpolatePoints(points1, points2, t) {
    const result = [];
    const maxLength = Math.max(points1.length, points2.length);
    
    for (let i = 0; i < maxLength; i++) {
        const p1 = points1[i % points1.length];
        const p2 = points2[i % points2.length];
        
        result.push({
            x: p1.x + (p2.x - p1.x) * t,
            y: p1.y + (p2.y - p1.y) * t
        });
    }
    
    return result;
}

// Function to convert points array back to string
function pointsToString(points) {
    return points.map(p => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ');
}

// Easing function for smoother transitions
function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Function to update polygons based on scroll progress
function updatePolygons(progress) {
    const totalFrames = keyframes[0].length;
    const frameProgress = progress * (totalFrames - 1);
    const currentFrame = Math.floor(frameProgress);
    const frameT = easeInOutCubic(frameProgress - currentFrame);
    
    // Update UI indicators
    // document.getElementById('progress').textContent = Math.round(progress * 100) + '%';
    // document.getElementById('frame').textContent = Math.min(currentFrame + 1, totalFrames);
    
    // Update each polygon
    polygons.forEach((polygon, index) => {
        const frames = keyframes[index];
        const frame1Index = currentFrame;
        const frame2Index = (currentFrame + 1) % frames.length;
        
        const points1 = parsePoints(frames[frame1Index]);
        const points2 = parsePoints(frames[frame2Index]);
        
        const interpolatedPoints = interpolatePoints(points1, points2, frameT);
        const newPointsString = pointsToString(interpolatedPoints);
        
        // Update the polygon's points attribute
        polygon.setAttribute('points', newPointsString);
    });
}

function updateEffects(velocity) {
    // if(DEBUG) console.log('velocity',velocity);
    let vOffset = (velocity / -10);
    let spread = 4 * Math.abs(velocity / 100);
    let vScale = 1 + Math.abs(velocity / 100);
    let vPos = 0;//(velocity / -100);
    let blur = Math.abs(velocity / 150) * 2;

    // add a motion blur
    // document.querySelector('.nav-top').style.boxShadow = '0 '+vOffset+'px '+spread+'px rgba(0, 0, 0, 0.13)';
    document.querySelector('.nav-top svg').style.transform = "scale(1.0,"+vScale+")  translateY("+vPos+"px)";
    document.querySelector('.nav-top svg').style.filter = "blur("+blur+"px)";
}

//This pauses the animation at specified points while scrolling
// function scrollPause (scrollProgress) {
//     let scrollPause = 0.25;//when to stop animation
//     let scrollResume = 0.75;
//     let animPause = 0.5;//what % of the animation do we want to pause at
//     let adjProgress = 0;

//     if(scrollProgress <= scrollPause) {
//         adjProgress = scrollProgress * (animPause / scrollPause);
//         // updatePolygons(adjProgress);
//     } else if(scrollProgress >= scrollResume) {
//         adjProgress = ((1 - animPause)/(1 - scrollResume)) * (scrollProgress - scrollResume) + animPause;
//         // updatePolygons(adjProgress);
//     } else {
//         // updatePolygons(animPause);
//         adjProgress = animPause;
//     }
//     return adjProgress;
// }


// Throttled scroll handler for better performance
let isScrolling = false;
let lastScroll = 0;
export function critterScroll() {
    window.clearTimeout( isScrolling );

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    let scrollProgress = Math.max(0, Math.min(1, scrollTop / scrollHeight));
    // scrollProgress = scrollPause(scrollProgress);
    updatePolygons(scrollProgress);

    let velocity = scrollTop - lastScroll;
    updateEffects(velocity);
    lastScroll = scrollTop;

    isScrolling = setTimeout(()=>{
        updateEffects(0);
    }, 66);
}

// Add scroll event listener
window.addEventListener('scroll', critterScroll);

// Optional: Add keyboard controls for precise scrubbing
/*
document.addEventListener('keydown', (e) => {
    const scrollAmount = 50;
    const currentScroll = window.pageYOffset;
    
    switch(e.key) {
        case 'ArrowDown':
        case 'j':
            window.scrollTo(0, currentScroll + scrollAmount);
            e.preventDefault();
            break;
        case 'ArrowUp':
        case 'k':
            window.scrollTo(0, currentScroll - scrollAmount);
            e.preventDefault();
            break;
        case 'Home':
            window.scrollTo(0, 0);
            e.preventDefault();
            break;
        case 'End':
            window.scrollTo(0, document.body.scrollHeight);
            e.preventDefault();
            break;
    }
});

// Add touch support for mobile
let touchStartY = 0;
document.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchmove', (e) => {
    const touchY = e.touches[0].clientY;
    const deltaY = touchStartY - touchY;
    const currentScroll = window.pageYOffset;
    
    window.scrollTo(0, currentScroll + deltaY * 2);
    touchStartY = touchY;
    e.preventDefault();
});
*/

// Initialize with first frame
updatePolygons(0);

