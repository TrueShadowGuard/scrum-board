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
