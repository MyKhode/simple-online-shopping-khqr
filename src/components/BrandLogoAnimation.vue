<template>
    <div class="container">
        <div title="RD-LAB CENTER LOGO" class="card z-20 cursor-pointer bg-gradient-to-r from-slate-300 to-slate-100 dark:bg-gradient-to-r dark:from-slate-900 dark:to-slate-700">
            <!-- <span class="text-slate-900 dark:text-slate-50 inline dark:hidden">RD</span>
            <span class="dark:text-slate-50 hidden dark:inline">AI</span> -->
            <span class="text-slate-900 font-extralight dark:text-slate-50">AI</span>
            <div class="lines">
                <!-- Top Lines -->
                <div class="line-top-1 animate-pulse z-1"></div>
                <div class="line-top-2 animate-pulse z-1"></div>

                <!-- Right Lines -->
                <div class="line-right-1 animate-pulse z-1"></div>
                <div class="line-right-2 animate-pulse z-1"></div>

                <!-- Bottom Lines -->
                <div class="line-bottom-1 animate-pulse z-1"></div>
                <div class="line-bottom-2 animate-pulse z-1"></div>
                <div class="line-bottom-3 animate-pulse z-1"></div>
            </div>
        </div>
    </div>


</template>
<style scoped>
@keyframes pulse {
    0% {
        box-shadow: 0 0 5px rgba(255, 255, 255, 0.1);
    }

    40% {
        box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
    }

    60% {
        box-shadow: 0 0 40px rgb(255, 255, 255);
    }

    100% {
        box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
    }
}

/* Card container with smooth breathing pulse effect */
.card {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 240px;
    height: 240px;
    border-radius: 25px;
    border: 4px solid rgb(136, 136, 136);
    position: relative;
    animation: pulse 6s infinite ease-in-out;
    /* Smooth breathing effect */
}


/* AI text */
.card span {
    font-size: 64px;
    font-weight: bold;
}

/* Styling for multiple connecting lines */
.lines {
    position: absolute;
    width: 100%;
    height: 100%;
}

.line-top-1 {
    position: absolute;
    width: 5px;
    /* Start wider */
    height: 150px;
    /* Increased height for better visibility */
    background: linear-gradient(to top, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
    top: -150px;
    left: 40%;
    transform: translateX(-50%);
    clip-path: polygon(0% 100%, 50% 0%, 100% 100%);
}

.line-top-2 {
    position: absolute;
    width: 5px;
    /* Start wider */
    height: 150px;
    /* Increased height for better visibility */
    background: linear-gradient(to top, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
    top: -150px;
    left: 60%;
    transform: translateX(-50%);
    clip-path: polygon(0% 100%, 50% 0%, 100% 100%);
}

/* .line-top-2 {
    position: absolute;
    width: 2px;
    height: 80px;
    background-color: rgba(255, 255, 255, 0.2);
    top: -90px;
    left: 50%;
    transform: translateX(-50%);
} */

/* Right 2 lines */
.line-right-1 {
    position: absolute;
    width: 350px;
    height: 5px;
    background: linear-gradient(to right, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
    right: -350px;
    top: 38%;
    transform: translateY(-50%);
    clip-path: polygon(0% 0%, 100% 50%, 0% 100%);
}


.line-right-2 {
    position: absolute;
    width: 350px;
    height: 5px;
    background: linear-gradient(to right, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
    right: -350px;
    top: 60%;
    transform: translateY(-50%);
    clip-path: polygon(0% 0%, 100% 50%, 0% 100%);
}

/* Bottom 3 lines */
/* .line-bottom-1 {
    position: absolute;
    width: 3px;
    height: 100px;
    background-color: rgba(255, 255, 255, 0.3);
    bottom: -120px;
    left: 50%;
    transform: translateX(-50%);
} */

.line-bottom-1 {
    position: absolute;
    width: 5px;
    height: 150px;
    /* Increased height for better visibility */
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
    bottom: -150px;
    left: 30%;
    transform: translateX(-50%);
    clip-path: polygon(0% 0%, 50% 100%, 100% 0%);
}

.line-bottom-2 {
    position: absolute;
    width: 5px;
    height: 150px;
    /* Increased height for better visibility */
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
    bottom: -150px;
    left: 50%;
    transform: translateX(-50%);
    clip-path: polygon(0% 0%, 50% 100%, 100% 0%);
}

.line-bottom-3 {
    position: absolute;
    width: 5px;
    height: 150px;
    /* Increased height for better visibility */
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
    bottom: -150px;
    left: 70%;
    transform: translateX(-50%);
    clip-path: polygon(0% 0%, 50% 100%, 100% 0%);
}
</style>