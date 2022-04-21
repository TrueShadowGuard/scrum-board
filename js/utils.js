function getBoxRelativelyDocument($element) {
    let box = $element.getBoundingClientRect();

    return {
        top: box.top + window.scrollY,
        right: box.right + window.scrollX,
        bottom: box.bottom + window.scrollY,
        left: box.left + window.scrollX,
        width: box.width,
        height: box.height
    }
}

async function smoothlyMove($element, x, y) {
    const animation = anime({
        targets: [$element],
        left: x,
        top: y,
        easing: "easeOutCubic",
        duration: 300,
    });
    return animation.finished;
}