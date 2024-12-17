// Timer state variables
let startTime = 0;
let lastStartTime = 0;
let lastServerTime = 0;
let timerInterval = null;
let isCountingUp = true;

function stopTimer() {
    $.ajax({
        url: "timecheck.php",
        type: "post",
        data: {action: "startOrStopTimer", start: "0"},
        success: function(results){
            console.log(results);
        }
    });
}

function startTimer() {
    const timeInput = document.getElementById('timeInput');
    if (!timeInput) {
        console.error('Time input element not found!');
        return;
    }
    
    const timeValues = parseTimeString(timeInput.value || '00:00:00');
    
    // Wait for the next clean second boundary
    const now = new Date();
    const msToNextSecond = 1000 - now.getMilliseconds();
    
    setTimeout(() => {
        $.ajax({
            url: "timecheck.php",
            type: "post",
            data: {
                action: "startOrStopTimer",
                start: "1",
                hour: timeValues.hour,
                minute: timeValues.minute,
                second: timeValues.second
            },
            success: function(results) {
                console.log('Timer start response:', results);
            }
        });
    }, msToNextSecond);
}

function toggleGetReady() {
    var $getReadyBtn = $("#getReadyBtn");
    var currentStatus = $getReadyBtn.data('active') ? 1 : 0;
    
    $.ajax({
        url: "timecheck.php",
        type: "post",
        data: {
            action: "toggleGetReady",
            status: currentStatus ? 0 : 1
        },
        success: function(results) {
            console.log(results);
        }
    });
}

function parseTimeString(timeStr) {
    // Handle empty or invalid input
    if (!timeStr) return { hour: "0", minute: "0", second: "0" };
    
    // Parse the time string (handling negative times)
    const isNegative = timeStr.startsWith('-');
    const cleanTime = timeStr.replace('-', '');
    const [hours, minutes, seconds] = cleanTime.split(':').map(num => num.padStart(2, '0'));
    
    // Apply negative sign if needed
    const multiplier = isNegative ? -1 : 1;
    
    return {
        hour: (parseInt(hours || 0) * multiplier).toString(),
        minute: (parseInt(minutes || 0) * multiplier).toString(),
        second: (parseInt(seconds || 0) * multiplier).toString()
    };
}

function formatTime(diffTime) {
    let isNegative = diffTime < 0;
    diffTime = Math.abs(diffTime);
    
    let h = new Date(diffTime).getUTCHours();
    let m = new Date(diffTime).getUTCMinutes();
    let s = new Date(diffTime).getUTCSeconds() % 60;
    
    h = h.toString().padStart(2, '0');
    m = m.toString().padStart(2, '0');
    s = s.toString().padStart(2, '0');
    
    return (isNegative ? '-' : '') + h + ':' + m + ':' + s;
}

function updateTimerDisplay(results) {
    if(results.started == 1) {
        const serverTime = new Date(results.unixtime * 1000).getTime();
        const newStartTime = new Date(results.start_time * 1000).getTime();
        
        // Only update our reference times if the server's time is newer
        if (serverTime > lastServerTime) {
            lastStartTime = newStartTime;
            lastServerTime = serverTime;
            isCountingUp = (serverTime - newStartTime) >= 0;
            
            // Start or restart the client-side timer
            if (!timerInterval) {
                startClientTimer();
            }
        }
    }
    
    if(results.started == 0) {
        startTime = 0;
        lastStartTime = 0;
        lastServerTime = 0;
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
        $("#status").html("stopwatch off");
        $("#stopwatch").html("00:00:00");
    }
}

function startClientTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    timerInterval = setInterval(() => {
        const now = Date.now();
        const diffTime = now - lastStartTime;
        
        if (isCountingUp) {
            $("#stopwatch").html(formatTime(diffTime));
            if (diffTime < 0) {
                $("#status").html("COUNTDOWN MODE - " + Math.abs(Math.floor(diffTime/1000)) + " seconds until start");
            } else {
                $("#status").html("ON!");
            }
        } else {
            // For countdown mode
            $("#stopwatch").html(formatTime(-diffTime));
            $("#status").html("COUNTDOWN MODE - " + Math.abs(Math.floor(diffTime/1000)) + " seconds until start");
        }
    }, 50); // Update every 50ms for smooth display
}

function initializeTimerCheck() {
    return setInterval(function(){
        $.ajax({
            url: "timecheck.php",
            type: "post",
            data: {action: "checkTimer"},
            success: function(results){
                results = $.parseJSON(results);
                $("#timer").html(results.curtime.toString());
                updateTimerDisplay(results);
            }
        });
    }, 1000); // Check server every second
}

function initializeGetReadyCheck(isControlPanel = false) {
    return setInterval(function(){
        $.ajax({
            url: "timecheck.php",
            type: "post",
            data: {action: "checkGetReady"},
            success: function(results) {
                results = $.parseJSON(results);
                if (results.getReady == 1) {
                    $(".get-ready-display").show().addClass('flashing');
                    if (isControlPanel) {
                        $("#getReadyBtn").data('active', true)
                                       .text("Stop Get Ready")
                                       .removeClass('btn-primary')
                                       .addClass('btn-danger');
                    }
                } else {
                    $(".get-ready-display").hide().removeClass('flashing');
                    if (isControlPanel) {
                        $("#getReadyBtn").data('active', false)
                                       .text("Get Ready")
                                       .removeClass('btn-danger')
                                       .addClass('btn-primary');
                    }
                }
            }
        });
    }, 100);
}