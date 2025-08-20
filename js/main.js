document.addEventListener('DOMContentLoaded', () => {
    const output = document.getElementById('output');
    const input = document.getElementById('input');
    const terminal = document.getElementById('terminal');

    const banner = `
     _                  
  __| | ___ _ __  _   _ 
 / _`` |/ _ \ '_ \| | | |
| (_| |  __/ | | | |_| |
 \__,_|\___|_| |_|\__, |
                  |___/ 
    `;

    const welcomeMessage = "Welcome to deny.gg! Type 'help' for a list of available commands.";

    let commandHistory = [];
    let historyIndex = -1;

    const commands = {
        help: () => {
            return 'Available commands: help, socials, clear';
        },
        socials: () => {
            return `
Discord: denyxo
Steam: <a href="https://steamcommunity.com/id/bioodiust/" target="_blank">https://steamcommunity.com/id/bioodiust/</a>
Twitch: <a href="https://twitch.tv/denyioi" target="_blank">https://twitch.tv/denyioi</a>
Spotify: <a href="https://open.spotify.com/user/60ji81i1at0figf5vqms9g06h" target="_blank">https://open.spotify.com/user/60ji81i1at0figf5vqms9g06h</a>
Anilist: <a href="https://anilist.co/user/deny" target="_blank">https://anilist.co/user/deny</a>
            `;
        },
        clear: () => {
            output.innerHTML = '';
            return '';
        }
    };

    const print = (message) => {
        const p = document.createElement('p');
        p.innerHTML = message;
        output.appendChild(p);
    };

    const handleCommand = (command) => {
        print(`> ${command}`);
        if (command in commands) {
            const result = commands[command]();
            if (result) {
                print(result);
            }
        } else {
            print(`Command not found: ${command}`);
        }
        commandHistory.push(command);
        historyIndex = commandHistory.length;
    };

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = input.value.trim();
            if (command) {
                handleCommand(command);
            }
            input.value = '';
        } else if (e.key === 'ArrowUp') {
            if (historyIndex > 0) {
                historyIndex--;
                input.value = commandHistory[historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                input.value = commandHistory[historyIndex];
            } else {
                historyIndex = commandHistory.length;
                input.value = '';
            }
        }
    });

    terminal.addEventListener('click', () => {
        input.focus();
    });

    print(banner);
    print(welcomeMessage);
    input.focus();
});
