import paper from 'paper';

export default (options = {}) => (
    new paper.Path.Circle({
        center: [200, 200],
        radius: 30,
        fillColor: '#fffff4',
        ...options,
    })
);