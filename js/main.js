document.addEventListener("click", onDeleteTaskClick);
document.addEventListener("pointerdown", onPointerDown);
document.addEventListener("click", onCreateButtonClick);
document.getElementById("clearAllButton").addEventListener("click", deleteAllTasks)

const $firstColumn = document.querySelector(".tasks-column");
const $firstColumnTasks = $firstColumn.querySelector(".tasks-column__tasks");

function onPointerDown(e) {
    const isDeleteButton = e.target.classList.contains("task__delete")
    const isTaskOrInsideTask = e.target.classList.contains("task-wrapper") || e.target.closest(".task-wrapper");
    if (!isTaskOrInsideTask || isDeleteButton) return;

    const $taskWrapper = e.target.classList.contains("task-wrapper") ? e.target : e.target.closest(".task-wrapper");

    $taskWrapper.setPointerCapture(e.pointerId);

    $taskWrapper.addEventListener("pointermove", onPointerMove);
    $taskWrapper.addEventListener("pointerup", onPointerUp);

    const $parentColumn = $taskWrapper.closest(".tasks-column__tasks");
    const startingBox = getBoxRelativelyDocument($taskWrapper);
    $taskWrapper.style.left = startingBox.left + "px";
    $taskWrapper.style.top = startingBox.top + "px";
    $taskWrapper.style.width = startingBox.width + "px";
    $taskWrapper.classList.add("task--moving");

    const offsetX = e.pageX - startingBox.left;
    const offsetY = e.pageY - startingBox.top;

    let $taskThumb = document.createElement("div");
    $taskThumb.style.height = startingBox.height + "px";
    $taskThumb.classList.add("task-thumb");
    $parentColumn.append($taskThumb);

    function onPointerMove(e) {
        $taskWrapper.style.left = (e.pageX - offsetX) + "px";
        $taskWrapper.style.top = (e.pageY - offsetY) + "px";

        const $taskColumn = get$TaskColumnAt(e.clientX, e.clientY);
        if ($taskColumn === null) {
            $parentColumn.append($taskThumb)
        } else {
            $taskColumn.append($taskThumb);
        }
    }

    async function onPointerUp(e) {
        $taskWrapper.removeEventListener("pointermove", onPointerMove);
        $taskWrapper.removeEventListener("pointerup", onPointerUp);
        $taskThumb.remove();

        const $taskColumn = get$TaskColumnAt(e.clientX, e.clientY);
        if ($taskColumn === null) {
            await smoothlyMove($taskWrapper, startingBox.left, startingBox.top);
            $taskWrapper.classList.remove("task--moving");
        } else {
            $taskWrapper.classList.remove("task--moving");
            $taskColumn.append($taskWrapper);
            const finishBox = getBoxRelativelyDocument($taskWrapper);
            $taskWrapper.classList.add("task--moving");

            await smoothlyMove($taskWrapper, finishBox.left, finishBox.top);
            $taskWrapper.classList.remove("task--moving");
            $taskColumn.append($taskWrapper);
        }

        $taskWrapper.style.cssText = "";
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

function onDeleteTaskClick(e) {
    const isSettings = e.target.classList.contains("task__delete");
    if (!isSettings) return;
    
    const $taskSettings = e.target;
    const $task = $taskSettings.closest(".task-wrapper");
    $task.remove();
}

function onCreateButtonClick(e) {
    const isCreateButton = e.target.id === "addTaskButton";
    if(!isCreateButton) return;
    
    $firstColumnTasks.append(createTask(window.prompt("Task text")));
}

function createTask(text) {
    const $taskWrapper = document.createElement("div");
    $taskWrapper.innerHTML = `
    <div class="task">
       <div class="task__text">${text}</div>
       <button class="task__delete">x</button>
    </div>
    `;
    $taskWrapper.classList.add("task-wrapper");
    return $taskWrapper;
}

function deleteAllTasks() {
    [...document.querySelectorAll(".task-wrapper")].forEach($el => $el.remove())
}