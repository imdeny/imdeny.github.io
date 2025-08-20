// Helper class
utils = {
    'spanText': function(clazz, text) {
        output = '';

        for (index = 0; index < arguments.length; index += 2) {
            output += '<span class="' + arguments[index] + '">' + arguments[inde
x + 1] + '</span>';
        }

        return output
    },

    'formatSpaces': function(name, spaces) {
        var emptyString = '';

        while (emptyString.length < spaces)
            emptyString += ' ';

        return (name + emptyString).slice(0, spaces);
    },

    'padNumber': function(value, spaces) {
        var emptyString = '';

        while (emptyString.length < spaces)
            emptyString += '0';

        return (emptyString + value).slice(('' + value).length);
    }
}


var Commands = function(hostline, user, group) {
    // Various dd parameters
    exponent = Math.floor((Math.random() * 4));
    hd_size = 64 << exponent; // Random but within the specified range
    dd_duration = (hd_size >> 6) * 500; // Make the base length stable
    dd_device = 'sda' // This probably won't gain 'coolness' from changing
    dd_block_size = 4 // Assumed MB

    var softLink = function(user, group, source, target) {
        return utils.spanText('fghvc54', '[' + source + ']') +
            ' -- ' +  utils.spanText('softlink-target', '<a class="softlink-targ
et" target="_blank" href=' + target + '>' + target + '</a>');
    }

    var ddCopyOutput = function(device, size_gb, block_size, duration) {
        var records = (size_gb << 10) / block_size;
        var variance = Math.random();
        var true_duration = duration / 1000.0 + variance;
        var throughput = size_gb / true_duration;

        // digit-trim hack to work
        var bytes_copied = (size_gb << 20) / 1000;
        bytes_copied <<= 10;

        return records + '+0 records in\n' +
            records + '+0 records out\n' +
            bytes_copied + '000 bytes (' + size_gb + ' GB) copied, ' +
            true_duration.toFixed(5) + ' s, ' + throughput.toFixed(1) + ' GB/s';
    }

    return {
        'poweroff': {
            typedCommand: "poweroff",
            startDelay: 1250,
            hesitation: 200,
            duration: 0,
            output: "\nBroadcast message from " + hostline + "\n\t\t(/dev/pts/0)
 at " +
                utils.padNumber(new Date().getHours(), 2) + ":" +
                utils.padNumber(new Date().getMinutes(), 2) + "...\n\n" +
                "The system is going down for halt NOW!"
        },
        'get_users': {
            typedCommand: 'ls love',
            startDelay: 900,
            hesitation: 500,
            duration: 500,
            output: "i am happiest when i am right next to you."
        },
        'ls_home': {
            typedCommand: 'ls socials',
            startDelay: 1250,
            hesitation: 200,
            duration: 100,
            output:
                "<3" +
                "\n" +
                "\n" +
                "-------------------------------------------" +
                "\n" +
                "\n" +
                utils.spanText('fghvc54',  "[discord]") + " -- denyxo" + '\n' +
                softLink(user, group, 'steam', 'https://steamcommunity.com/id/bi
oodiust/') +
                "\n" +
                "\n" +
                "-------------------------------------------" +
                "\n" +
                "\n" +
                softLink(user, group, 'twitch', 'https://twitch.tv/denyioi') + '
\n' +
                softLink(user, group, 'spotify', 'https://open.spotify.com/user/
60ji81i1at0figf5vqms9g06h') + '\n' +
                softLink(user, group, 'anime list', 'https://anilist.co/user/den
y') + '\n' +
        },
        'dd_partition': {
            typedCommand: 'dd if=/dev/urandom of=temp.bin bs=4M count=' + (hd_size / 4) + ' status=progress',
            startDelay: 200,
            hesitation: 1200,
            duration: dd_duration,
            output: ddCopyOutput(dd_device, hd_size, dd_block_size, dd_duration)
        }
    };
};

var Scroller = function(target) {
    hostline = "me@" + (window.location.hostname || 'localhost');
    bash_prompt = utils.spanText('prompt-hostline', hostline,
        'prompt-normal', ":",
        'prompt-path', "~",
        'prompt-normal', "# ");

    commands = new Commands(hostline, 'sg', 'sg');

    textSpeed = 19;
    textSpeedJitter = 12;
    textStartSpeed = 800;
    newlineSpeed = 400;
    promptDelay = 1000;

    textPos = 0;

    commandList = ['get_users', 'ls_home', 'dd_partition', 'poweroff'];

    cursorSpeed = 500;
    cursorShowing = false;
    cursorStates = ['_', ' '];

    addTextInstant = function(targetElement, text) {
        // console.log(target);

        var oldText = targetElement.innerHTML;
        targetElement.innerHTML = oldText + text;
    };

    removeCursor = function(targetElement) {
        var oldText = targetElement.innerHTML;
        targetElement.innerHTML = oldText.substring(0, oldText.length - 1);
    };

    addPrompt = function(targetElement) {
        addTextInstant(targetElement, bash_prompt);
    };

    // TODO: Do something with this (if anything)
    updateCursorState = function(text) {
        var oldText = document.getElementById(target).innerHTML || "";

        if (!text) {
            oldText += " ";
        }

        this.cursorShowing = !this.cursorShowing;

        newText = oldText.substring(0, oldText.length - 1) + this.cursorStates[t
his.cursorShowing ? 0 : 1];
        document.getElementById(target).innerHTML = newText;
        setTimeout(function() {
                this.updateCursorState(newText);
            },
            this.cursorSpeed);
    };

    addTypedText = function(targetElement, typedText, commandIndex,
 originalText, textIndex) {
        // Could have assumed ECMA6 and done default params but this is more com
patible
        if (!originalText)
            originalText = targetElement.innerHTML;

        if (!textIndex)
            textIndex = 0;

        this.addTextInstant(targetElement, typedText.substring(textIndex, textIn
dex + 1));

        if (textIndex <= typedText.length) {
            textIndex++;
            if (textIndex == typedText.length) {
                this.addTextInstant('_');
                setTimeout(function() {
                        printCommandOutput(targetElement, command, commandIndex)
;
                    },
                    command.hesitation);
            } else {
                randomJitter = this.textSpeedJitter * Math.random();
                jitteredTextSpeed = this.textSpeed + (randomJitter / 2);

                // console.log("Jitter:", jitteredTextSpeed);

                setTimeout(function() {
                        this.addTypedText(targetElement, typedText, commandIndex
, originalText, textIndex);
                    },
                    jitteredTextSpeed);
            }
        }
    };

    typeCommand = function(targetElement, command, index) {
        addTypedText(targetElement, command.typedCommand + '\n', index);
    };

    // Prints the prompt and executes a single command and displays it's output
    printCommandOutput = function(targetElement, command, commandIndex) {.
        removeCursor(targetElement);

        var outputElement = document.createElement('p');
        outputElement.className += "command-output";

        targetElement.appendChild(outputElement);
        addTextInstant(outputElement, command.output);

        setTimeout(function() {
                executeCommands(targetElement, commandIndex + 1);
            },
            promptDelay);
    };

    // Prints the prompt, types the command, and then executes it
    executeCommand = function(targetElement, commandIndex) {
        commandName = commandList[commandIndex];
        command = commands[commandName];
        console.log('Command: ' + commandName);

        addPrompt(targetElement);

        setTimeout(function() {
                typeCommand(targetElement, command, commandIndex);
            },
            command.startDelay);
    };

    // Executes one command at a time from the commandList
    executeCommands = function(targetElement, commandIndex) {
        if (!commandIndex)
            commandIndex = 0;

        if (commandIndex >= commandList.length)
            return;

        var targetElement = document.createElement('p');
        targetElement.id = 'command_' + commandIndex;

        document.getElementById(target).appendChild(targetElement);

        executeCommand(targetElement, commandIndex);
    };

    executeCommands();
}
