/* ----------------------------------------
QUADTREE FOR OPTIMIZATION
---------------------------------------- */
class QuadTree {
    constructor(boundary, capacity) {
        this.boundary = boundary;
        this.capacity = capacity;
        this.boids = [];
        this.divided = false;
    }

    subdivide() {
        const { x, y, w, h } = this.boundary;

        const nw = new Rectangle(x - w / 2, y - h / 2, w / 2, h / 2);
        this.northwest = new QuadTree(nw, this.capacity);
        const ne = new Rectangle(x + w / 2, y - h / 2, w / 2, h / 2);
        this.northeast = new QuadTree(ne, this.capacity);
        const sw = new Rectangle(x - w / 2, y + h / 2, w / 2, h / 2);
        this.southwest = new QuadTree(sw, this.capacity);
        const se = new Rectangle(x + w / 2, y + h / 2, w / 2, h / 2);
        this.southeast = new QuadTree(se, this.capacity);

        this.divided = true;
    }

    insert(boid) {
        if (!this.boundary.contains(boid)) {
            return false;
        }

        if (this.boids.length < this.capacity) {
            this.boids.push(boid);
            return true;
        } else {
            if (!this.divided) {
                this.subdivide();
            }
            if (this.northwest.insert(boid)) return true;
            if (this.northeast.insert(boid)) return true;
            if (this.southwest.insert(boid)) return true;
            if (this.southeast.insert(boid)) return true;
        }
    }

    query(range, found) {
        if (!found) {
            found = [];
        }

        if (!this.boundary.intersects(range)) {
            return found;
        }

        for (let boid of this.boids) {
            if (range.contains(boid)) {
                found.push(boid);
            }
        }

        if (this.divided) {
            this.northwest.query(range, found);
            this.northeast.query(range, found);
            this.southwest.query(range, found);
            this.southeast.query(range, found);
        }

        return found;
    }

    clear() {
        this.boids = [];
        if (this.divided) {
            this.northwest.clear();
            this.northeast.clear();
            this.southwest.clear();
            this.southeast.clear();
        }
    }
}

class Rectangle {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    contains(boid) {
        return (boid.x >= this.x - this.w &&
            boid.x < this.x + this.w &&
            boid.y >= this.y - this.h &&
            boid.y < this.y + this.h);
    }

    intersects(range) {
        return !(range.x - range.w > this.x + this.w ||
            range.x + range.w < this.x - this.w ||
            range.y - range.h > this.y + this.h ||
            range.y + range.h < this.y - this.h);
    }
}


let friends = quadTree.query(new Rectangle(this.x, this.y, Boid.range, Boid.range));


function setup() {
    const boundary = new Rectangle(0, 0, 2, 2);
    window.quadTree = new QuadTree(boundary, 10);
}
