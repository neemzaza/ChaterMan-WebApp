import $ from 'jquery'

// $(".mainBody").on('touchstart', (e) => onStartTouching(e.touches[0].clientX))
// $(".mainBody").on('touchend', () => onStopTouching())
// $(".mainBody").on('touchmove', (e) => onMovingScreen(e.changedTouches[0].clientX, e.changedTouches[0].clientY))

let posTouch = 0;
export const onStartTouching = (pos) => {
    posTouch = pos
    console.log(posTouch)
}

let pxMove = 0;
let lastDir
let lastDirY
export const onMovingScreen = (dir, dirY) => {
    console.log($(".body").width())

    if (posTouch <= $(".body").width() / 1.2) return console.dir("NOT PASSED #POS")


    if (dirY > lastDirY) {
        console.log("DOWN: " + lastDirY)
        lastDirY = dirY
        return
        // pxMoveY--;
        // console.log(pxMoveY)
    }

    if (dirY < lastDirY) {
        console.log("UP: " + lastDirY)
        lastDirY = dirY
        return
        // pxMoveY++;
        // console.log(pxMoveY)
    }

    // if (pxMoveY > 0) return console.log("NOT PASSED: " + pxMoveY)

    if (dir > lastDir) {
        console.log("Left")
        pxMove--;
        $(".body").css("right", "0")
    }

    if (dir < lastDir) {
        console.log("Right")
        pxMove++;
        $(".body").css("right", "70px")
    }

    if (pxMove < 0) {
        console.log(pxMove)
        $(".body").css("right", "0")
        pxMove = 0;
    }
    if (pxMove > 70) {
        console.log(pxMove)
        $(".body").css("right", "70px")
        pxMove = 70;
    }

    // if ()
    // $(".body").css("right", pxMove + "px")
    $(".body").css("overflow", "hidden")
    lastDir = dir
}

export const onStopTouching = () => {
    if (pxMove < 0) {
        $(".body").css("right", "0")
    }
    if (pxMove > 70) {
        $(".body").css("right", "70px")
    }
    pxMove = 0
    $(".body").css({
        "overflow-x": "hidden",
        "overflow-y": "scroll"
    })
}