document.addEventListener("pointerdown", onPointerDown);

function onPointerDown(e) {
    const isTaskOrInsideTask = e.target.classList.contains("task") || e.target.closest(".task")
    if (!isTaskOrInsideTask) return;

    const $task = e.target;

    $task.setPointerCapture(e.pointerId);

    $task.addEventListener("pointermove", onPointerMove);
    $task.addEventListener("pointerup", onPointerUp);

    const $parentColumn = $task.closest(".tasks-column__tasks");
    const startingBox = getBoxRelativelyDocument($task);
    $task.style.left = startingBox.left + "px";
    $task.style.top = startingBox.top + "px";
    $task.style.width = startingBox.width + "px";
    $task.classList.add("task--moving");

    const offsetX = e.pageX - startingBox.left;
    const offsetY = e.pageY - startingBox.top;
    
    let $taskThumb = document.createElement("div");
    $taskThumb.style.height = startingBox.height + "px";
    $taskThumb.classList.add("task-thumb");
    $parentColumn.append($taskThumb);

    function onPointerMove(e) {
        $task.style.left = (e.pageX - offsetX) + "px";
        $task.style.top = (e.pageY - offsetY) + "px";
        
        const $taskColumn = get$TaskColumnAt(e.pageX, e.pageY);
        if($taskColumn !== null) {
            $taskColumn.append($taskThumb);
        }
    }

    async function onPointerUp(e) {
        $task.removeEventListener("pointermove", onPointerMove);
        $task.removeEventListener("pointerup", onPointerUp);
        $taskThumb.remove();

        const $taskColumn = get$TaskColumnAt(e.pageX, e.pageY);
        if ($taskColumn === null) {
            await smoothlyMove($task, startingBox.left, startingBox.top);
            $task.classList.remove("task--moving");
        }

        $task.classList.remove("task--moving");
        $taskColumn.append($task);
        const finishBox = getBoxRelativelyDocument($task);
        $task.classList.add("task--moving");

        await smoothlyMove($task, finishBox.left, finishBox.top);
        $task.classList.remove("task--moving");
        $taskColumn.append($task);
    }
}

function get$TaskColumnAt(x, y) {
    const elementsFromPoint = [...document.elementsFromPoint(x, y)];
    for (let $element of elementsFromPoint) {
        if ($element.classList.contains("tasks-column__tasks")) {
            return $element;
        }
    }
    return null;
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