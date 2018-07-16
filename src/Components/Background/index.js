import React, { PureComponent } from 'react';
import { Capsule } from '@iosio/capsule';
import createStar from './canvas/star';
import randomPoint from './canvas/point';
import paper from 'paper';

class Background extends PureComponent {
    componentDidMount() {
        paper.setup(this.canvas);
        const star = createStar({
            center: randomPoint(),
            radius: 7.5,
        });

        let mousePos = paper.view.center.add([paper.view.bounds.width / 3, 100]);
        let position = paper.view.center;
        var maxX = window.outerWidth;
        var maxY = window.outerHeight;

        const strength = 10;
        const symbol = new paper.Symbol(star);
        const stars = new Array(50)
            .fill(0)
            .map((_, i, arr) => {
                const clone = symbol.place(randomPoint());
                clone.scale(i / arr.length);
                clone.fadeIn = Math.random() > .95;
                if (clone.fadeIn) {
                    clone.opacity = 0;
                }
                return clone;
            });
            
        paper.view.onMouseMove = (event) => {
            mousePos = event.point;
        };

        window.addEventListener("deviceorientation", function(event) {
            let x = event.beta;
            let y = event.gamma;
            if (x >  90) { x =  90};
            if (x < -90) { x = -90};
            x += 90;
            y += 90;
            mousePos = paper.view.center.add([maxX*x/180, maxY*y/180]);
        });

        this.canvas.addEventListener('mousewheel', (event) => {
            stars.forEach((item) => {
                item.scale(1 - (event.deltaY / 1000));
                console.log(item);
            })
            return false; 
        }, false);

        const keepInFrame = (item) => {
            const position = item.position;
            const viewBounds = paper.view.bounds;
            if (position.isInside(viewBounds))
                return;
            var itemBounds = item.bounds;
            if (position.x > viewBounds.width + 5) {
                position.x = -item.bounds.width;
            }

            if (position.x < -itemBounds.width - 5) {
                position.x = viewBounds.width;
            }

            if (position.y > viewBounds.height + 5) {
                position.y = -itemBounds.height;
            }

            if (position.y < -itemBounds.height - 5) {
                position.y = viewBounds.height
            }
        }

        paper.view.onFrame = (event) => {
            position = position.add(mousePos.subtract(position).divide(strength));
            const vector = paper.view.center.subtract(position).divide(strength);
            stars.forEach((item) => {
                var size = item.bounds.size;
                var length = vector.length / strength * size.width / strength;
                item.position = item.position.add(vector.normalize(length).add(item.data.vector));
                item.position.x += item.bounds.width / strength * 2;
                if (Math.random() > .995) {
                    item.fadeIn = !item.fadeIn;
                }

                if(item.fadeIn) {
                    item.opacity += .005;
                } else {
                    item.opacity -= .005;
                }

                if (item.opacity >= 1) {
                    item.fadeIn = false;
                }

                if (item.opacity < .05 && !item.fadeIn) {
                    item.opacity = .045;
                    item.fadeIn = true;
                }
                keepInFrame(item);
            });
        
        }
    }
    render() {
        const { classes } = this.props;
        return (
            <canvas ref={(r) => this.canvas = r} className={classes.canvas} />
        );
    }
}

export default Capsule({
    styles: {
        canvas: {
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'black',
        },
    }
})(Background);