


function generateBrainCellStructure_old(size, colour, id) {
    var x = size[0];
    var y = size[1];
    var z = size[2];
    function createSphere(center, radius, resolution) {
        const points = [];
        for (let i = 0; i <= resolution; i++) {
            const theta = Math.PI * (i / resolution); // Polar angle
            for (let j = 0; j <= resolution * 2; j++) {
                const phi = Math.PI * 2 * (j / (resolution * 2)); // Azimuthal angle
                const px = center[0] + radius * Math.sin(theta) * Math.cos(phi);
                const py = center[1] + radius * Math.sin(theta) * Math.sin(phi);
                const pz = center[2] + radius * Math.cos(theta);
                points.push([px, py, pz]);
            }
        }
        return points;
    }

    function createTriangles(points, resolution) {
        const triangles = [];
        for (let i = 0; i < resolution; i++) {
            for (let j = 0; j < resolution * 2; j++) {
                const p1 = points[i * (resolution * 2 + 1) + j];
                const p2 = points[i * (resolution * 2 + 1) + (j + 1) % (resolution * 2 + 1)];
                const p3 = points[(i + 1) * (resolution * 2 + 1) + j];
                const p4 = points[(i + 1) * (resolution * 2 + 1) + (j + 1) % (resolution * 2 + 1)];

                triangles.push([p1, p2, p3]); // Upper triangle
                triangles.push([p2, p4, p3]); // Lower triangle
            }
        }
        return triangles;
    }

    function distortPoints(points, magnitude) {
        return points.map(([px, py, pz]) => {
            const dx = (Math.random() - 0.5) * magnitude;
            const dy = (Math.random() - 0.5) * magnitude;
            const dz = (Math.random() - 0.5) * magnitude;
            return [px + dx, py + dy, pz + dz];
        });
    }

    function createTentacles(center, numTentacles, length, spread) {
        const tentacles = [];
        for (let i = 0; i < numTentacles; i++) {
            const start = [
                center[0] + (Math.random() - 0.5) * spread,
                center[1] + (Math.random() - 0.5) * spread,
                center[2] + (Math.random() - 0.5) * spread
            ];
            let currentPoint = start;

            for (let j = 0; j < length; j++) {
                const nextPoint = [
                    currentPoint[0] + (Math.random() - 0.5) * 10, // Increase length of tentacle segments
                    currentPoint[1] + (Math.random() - 0.5) * 10,
                    currentPoint[2] + (Math.random() - 0.5) * 10
                ];
                const thickness = (length - j) * 0.5; // Gradual thinning of tentacle
                tentacles.push({
                    segment: [currentPoint, nextPoint],
                    thickness: thickness
                });
                currentPoint = nextPoint;
            }
        }
        return tentacles;
    }

    function tentaclesToTriangles(tentacles) {
        const triangles = [];
        tentacles.forEach(({ segment, thickness }) => {
            const [p1, p2] = segment;
            const offset = [
                (Math.random() - 0.5) * thickness,
                (Math.random() - 0.5) * thickness,
                (Math.random() - 0.5) * thickness
            ];
            const p3 = [
                p2[0] + offset[0],
                p2[1] + offset[1],
                p2[2] + offset[2]
            ];
            triangles.push([p1, p2, p3]);
        });
        return triangles;
    }

    // Define the center and radius for the sphere
    const center = [x / 2, y / 2, z / 2];
    const radius = Math.min(x, y, z) / 4;
    const resolution = 20; // Adjust for sphere detail

    // Create the base sphere
    const spherePoints = createSphere(center, radius, resolution);

    // Distort the sphere to resemble a brain cell
    const distortedPoints = distortPoints(spherePoints, radius * 0.2);

    // Create triangles for the distorted sphere
    const triangles = createTriangles(distortedPoints, resolution);

    // Add tentacles/synapses
    const tentacles = createTentacles(center, 8, 50, radius * 3); // Increase length and spread of tentacles
    const tentacleTriangles = tentaclesToTriangles(tentacles);

    // Combine sphere and tentacle triangles
   
    const result = [...triangles, ...tentacleTriangles].map( t => new Triangle(t));
    return new Geometry(result, 'brain cell', colour, id);
}

/**
 * 
 * 
 * 
 * 
 * -----------------------
 */




function generateBrainCellStructure(size, colour, id) {
    var x = size[0];
    var y = size[1];
    var z = size[2];
    function createSphere(center, radius, resolution) {
        const points = [];
        for (let i = 0; i <= resolution; i++) {
            const theta = Math.PI * (i / resolution); // Polar angle
            for (let j = 0; j <= resolution * 2; j++) {
                const phi = Math.PI * 2 * (j / (resolution * 2)); // Azimuthal angle
                const px = center[0] + radius * Math.sin(theta) * Math.cos(phi);
                const py = center[1] + radius * Math.sin(theta) * Math.sin(phi);
                const pz = center[2] + radius * Math.cos(theta);
                points.push([px, py, pz]);
            }
        }
        return points;
    }

    function createTriangles(points, resolution) {
        const triangles = [];
        for (let i = 0; i < resolution; i++) {
            for (let j = 0; j < resolution * 2; j++) {
                const p1 = points[i * (resolution * 2 + 1) + j];
                const p2 = points[i * (resolution * 2 + 1) + (j + 1) % (resolution * 2 + 1)];
                const p3 = points[(i + 1) * (resolution * 2 + 1) + j];
                const p4 = points[(i + 1) * (resolution * 2 + 1) + (j + 1) % (resolution * 2 + 1)];

                triangles.push([p1, p2, p3]); // Upper triangle
                triangles.push([p2, p4, p3]); // Lower triangle
            }
        }
        return triangles;
    }

    function createCylinder(start, end, radiusStart, radiusEnd, segments) {
        const triangles = [];
        const axis = [
            end[0] - start[0],
            end[1] - start[1],
            end[2] - start[2]
        ];
        const length = Math.sqrt(axis[0] ** 2 + axis[1] ** 2 + axis[2] ** 2);
        const normalizedAxis = axis.map((v) => v / length);

        const circle = [];
        for (let i = 0; i < segments; i++) {
            const angle = (i / segments) * 2 * Math.PI;
            circle.push([Math.cos(angle), Math.sin(angle)]);
        }

        for (let i = 0; i < segments; i++) {
            const [x1, y1] = circle[i];
            const [x2, y2] = circle[(i + 1) % segments];

            const baseStart = [
                start[0] + x1 * radiusStart,
                start[1] + y1 * radiusStart,
                start[2]
            ];

            const baseEnd = [
                start[0] + x2 * radiusStart,
                start[1] + y2 * radiusStart,
                start[2]
            ];

            const topStart = [
                end[0] + x1 * radiusEnd,
                end[1] + y1 * radiusEnd,
                end[2]
            ];

            const topEnd = [
                end[0] + x2 * radiusEnd,
                end[1] + y2 * radiusEnd,
                end[2]
            ];

            triangles.push([baseStart, baseEnd, topStart]);
            triangles.push([baseEnd, topEnd, topStart]);
        }

        return triangles;
    }

    function createCone(base, tip, baseRadius, segments) {
        const triangles = [];
        const circle = [];
        for (let i = 0; i < segments; i++) {
            const angle = (i / segments) * 2 * Math.PI;
            circle.push([Math.cos(angle), Math.sin(angle)]);
        }

        for (let i = 0; i < segments; i++) {
            const [x1, y1] = circle[i];
            const [x2, y2] = circle[(i + 1) % segments];

            const baseStart = [
                base[0] + x1 * baseRadius,
                base[1] + y1 * baseRadius,
                base[2]
            ];

            const baseEnd = [
                base[0] + x2 * baseRadius,
                base[1] + y2 * baseRadius,
                base[2]
            ];

            triangles.push([baseStart, baseEnd, tip]);
        }

        return triangles;
    }

    function createTentacle(base, segments, length, radiusStart, radiusEnd) {
        const triangles = [];
        let currentBase = base;
        let currentRadius = radiusStart;

        for (let i = 0; i < segments; i++) {
            const nextBase = [
                currentBase[0] + (Math.random() - 0.5) * length,
                currentBase[1] + (Math.random() - 0.5) * length,
                currentBase[2] + (Math.random() - 0.5) * length
            ];

            const nextRadius = currentRadius - (radiusStart - radiusEnd) / segments;
            triangles.push(...createCylinder(currentBase, nextBase, currentRadius, nextRadius, 12));

            currentBase = nextBase;
            currentRadius = nextRadius;
        }

        const tip = [
            currentBase[0],
            currentBase[1],
            currentBase[2] + length * 0.5
        ];

        triangles.push(...createCone(currentBase, tip, currentRadius, 12));

        return triangles;
    }

    // Define the center and radius for the sphere
    const center = [x / 2, y / 2, z / 2];
    const radius = Math.min(x, y, z) / 4;
    const resolution = 20; // Adjust for sphere detail

    // Create the base sphere
    const spherePoints = createSphere(center, radius, resolution);
    const sphereTriangles = createTriangles(spherePoints, resolution);

    // Add tentacles
    const tentacleTriangles = [];
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const base = [
            center[0] + Math.cos(angle) * radius,
            center[1] + Math.sin(angle) * radius,
            center[2]
        ];
        tentacleTriangles.push(...createTentacle(base, 6, radius * 2, radius * 0.3, radius * 0.05));
    }


    const result = [...sphereTriangles, ...tentacleTriangles].map( t => new Triangle(t));
    return new Geometry(result, 'brain cell', colour, id);
}



/**
 * 
 * 
 * 
 * 
 * -------------------------
 */



function generateChristmasTree(size, colour, id) {
    var x = size[0];
    var y = size[1];
    var z = size[2];
    function createCylinder(base, top, radius, segments) {
        const triangles = [];
        for (let i = 0; i < segments; i++) {
            const angle1 = (i / segments) * 2 * Math.PI;
            const angle2 = ((i + 1) / segments) * 2 * Math.PI;

            const base1 = [
                base[0] + radius * Math.cos(angle1),
                base[1] + radius * Math.sin(angle1),
                base[2]
            ];

            const base2 = [
                base[0] + radius * Math.cos(angle2),
                base[1] + radius * Math.sin(angle2),
                base[2]
            ];

            const top1 = [
                top[0] + radius * Math.cos(angle1),
                top[1] + radius * Math.sin(angle1),
                top[2]
            ];

            const top2 = [
                top[0] + radius * Math.cos(angle2),
                top[1] + radius * Math.sin(angle2),
                top[2]
            ];

            triangles.push([base1, base2, top1]);
            triangles.push([base2, top2, top1]);
        }
        return triangles;
    }

    function createCone(base, tip, radius, segments) {
        const triangles = [];
        for (let i = 0; i < segments; i++) {
            const angle1 = (i / segments) * 2 * Math.PI;
            const angle2 = ((i + 1) / segments) * 2 * Math.PI;

            const base1 = [
                base[0] + radius * Math.cos(angle1),
                base[1] + radius * Math.sin(angle1),
                base[2]
            ];

            const base2 = [
                base[0] + radius * Math.cos(angle2),
                base[1] + radius * Math.sin(angle2),
                base[2]
            ];

            triangles.push([base1, base2, tip]);
        }
        return triangles;
    }

    function createStar(center, size) {
        const triangles = [];
        const points = [];
        const depth = size * 0.2;

        for (let i = 0; i < 10; i++) {
            const angle = (i / 10) * Math.PI * 2;
            const radius = i % 2 === 0 ? size : size * 0.5;
            points.push([
                center[0] + radius * Math.cos(angle),
                center[1] + radius * Math.sin(angle),
                center[2]
            ]);
        }

        for (let i = 0; i < 10; i++) {
            triangles.push([
                center,
                points[i],
                points[(i + 1) % 10]
            ]);
        }

        // Extrude the star upward
        const tip = [center[0], center[1], center[2] + depth];
        for (let i = 0; i < 10; i++) {
            triangles.push([
                points[i],
                points[(i + 1) % 10],
                tip
            ]);
        }

        return triangles;
    }

    const base = [x / 2, y / 2, 0];
    const trunkHeight = z * 0.2;
    const trunkRadius = x * 0.05;
    const treeHeight = z * 0.8;
    const treeBaseRadius = x * 0.3;
    const starSize = x * 0.1;

    // Create trunk
    const trunkTop = [base[0], base[1], trunkHeight];
    const trunkTriangles = createCylinder(base, trunkTop, trunkRadius, 16);

    // Create tree layers
    const treeTriangles = [];
    const numLayers = 8;
    const layerHeight = treeHeight / (numLayers + 1);
    for (let i = 0; i < numLayers; i++) {
        const layerBase = [
            base[0],
            base[1],
            trunkHeight + i * layerHeight * 0.8 // Closer layers
        ];
        const layerTip = [
            base[0],
            base[1],
            trunkHeight + (i + 1) * layerHeight * 0.8
        ];
        const layerRadius = treeBaseRadius * (1 - i / numLayers);
        treeTriangles.push(...createCone(layerBase, layerTip, layerRadius, 32));
    }

    // Create star
    const treeTop = [
        base[0],
        base[1],
        trunkHeight + treeHeight
    ];
    const starTriangles = createStar(treeTop, starSize);

    // Combine all parts
   // const result = [...trunkTriangles, ...treeTriangles, ...starTriangles].map( t => new Triangle(t));
    return {
      trunk: new Geometry([...trunkTriangles].map( t => new Triangle(t)), 'trunk', colour, id),
      tree: new Geometry([...treeTriangles].map( t => new Triangle(t)), 'tree', colour, id),
      star: new Geometry([...starTriangles].map( t => new Triangle(t)), 'star', colour, id),
    };  
    
}


