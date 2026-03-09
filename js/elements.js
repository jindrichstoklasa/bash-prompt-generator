// Element Definitions
        const ELEMENT_CATEGORIES = {
            'Date & Time': [
                { id: 'date', name: 'Date', code: '\\d{+%Y-%m-%d}', preview: '2026-03-08', icon: 'đź“…' },
                { id: 'custom_date', name: 'Custom date / time', code: '\\d{+%Y-%m-%d %H:%M:%S}', preview: '2026-03-08 14:30:45', icon: 'đź•' },
                { id: 'time24h', name: 'Time (24-hour)', code: '\\t', preview: '\\t', icon: 'âŹ°' },
                { id: 'time12h', name: 'Time (12-hour)', code: '\\d{+%I:%M %p}', preview: '02:30 PM', icon: 'đź•' },
                { id: 'time_ampm', name: 'Time (AM/PM)', code: '\\d{+%p}', preview: 'PM', icon: 'đź•‘' },
                { id: 'time_no_sec', name: 'Time (24h no seconds)', code: '\\d{+%H:%M}', preview: '14:30', icon: 'âŹ±ď¸Ź' },
                { id: 'unix_time', name: 'Unix timestamp', code: '\\d{+%s}', preview: '1741414245', icon: 'đź”˘' },
                { id: 'timezone', name: 'Time zone', code: '\\d{+%Z}', preview: 'CET', icon: 'đźŚŤ' }
            ],
            'User': [
                { id: 'username', name: 'Username', code: '\\u', preview: 'neiki', icon: 'đź‘¤' },
                { id: 'user_root', name: 'User / Root indicator', code: '\\#', preview: '$', icon: 'đź”' },
                { id: 'uid', name: 'User ID', code: '\\d{+$(id -u)}', preview: '1000', icon: 'đź†”' }
            ],
            'Host & System': [
                { id: 'hostname_short', name: 'Hostname (short)', code: '\\h', preview: 'mypc', icon: 'đź–Ąď¸Ź' },
                { id: 'hostname_full', name: 'Hostname (full)', code: '\\H', preview: 'mypc.example.com', icon: 'đźŚ' },
                { id: 'shell_name', name: 'Shell name', code: '\\l', preview: 'pts/0', icon: 'đźš' },
                { id: 'bash_version', name: 'Bash version', code: '\\d{+${BASH_VERSION%.*}}', preview: '5.2', icon: 'đź“¦' },
                { id: 'bash_full', name: 'Bash version (full)', code: '\\d{+${BASH_VERSION}}', preview: '5.2.21', icon: 'đź“¦' },
                { id: 'terminal', name: 'Terminal device', code: '\\l', preview: 'pts/1', icon: 'âŚ¨ď¸Ź' },
                { id: 'shell_level', name: 'Shell level', code: '\\d{+${SHLVL}}', preview: '1', icon: 'đź“Š' }
            ],
            'Directory': [
                { id: 'pwd_full', name: 'Current directory (full path)', code: '\\w', preview: '/home/neiki/projects', icon: 'đź“‚' },
                { id: 'pwd_name', name: 'Current directory (folder name)', code: '\\W', preview: 'projects', icon: 'đź“' },
                { id: 'pwd_home', name: 'Path with home shortcut', code: '\\d{+${PWD/#$HOME/~}}', preview: '~/projects', icon: 'đźŹ ' },
                { id: 'pwd_prev', name: 'Previous directory', code: '\\d{+${OLDPWD/#$HOME/~}}', preview: '~/documents', icon: 'âŹŞ' },
                { id: 'pwd_depth', name: 'Directory depth', code: '\\d{+$(pwd | tr -cd / | wc -c)}', preview: '3', icon: 'đź“Š' }
            ],
            'Commands & History': [
                { id: 'history_num', name: 'Command history number', code: '\\!', preview: '245', icon: 'đź“ś' },
                { id: 'cmd_num', name: 'Command number in session', code: '\\#', preview: '42', icon: 'đź”˘' },
                { id: 'exit_status', name: 'Last command exit status', code: '\\d{+$?}', preview: '0', icon: 'âś“' },
                { id: 'success_indicator', name: 'Success indicator', code: '\\d{+$([ $? -eq 0 ] && echo "âś“" || echo "âś—")}', preview: 'âś“', icon: 'âś…' },
                { id: 'error_indicator', name: 'Error indicator', code: '\\d{+$([ $? -ne 0 ] && echo "âś—" || echo "âś“")}', preview: 'âś—', icon: 'âťŚ' }
            ],
            'Processes': [
                { id: 'bg_jobs', name: 'Background jobs count', code: '\\d{+$(jobs -r | wc -l)}', preview: '0', icon: 'âš™ď¸Ź' },
                { id: 'shell_pid', name: 'Shell process ID', code: '\\d{+$$}', preview: '12545', icon: 'đź”˘' },
                { id: 'parent_pid', name: 'Parent process ID', code: '\\d{+${PPID}}', preview: '12544', icon: 'đź‘¨' },
                { id: 'running_procs', name: 'Running processes count', code: '\\d{+$(ps aux | wc -l)}', preview: '145', icon: 'đź“Š' }
            ],
            'Version Control': [
                { id: 'git_branch', name: 'Git branch', code: '\\d{+$(git branch --show-current 2>/dev/null)}', preview: 'main', icon: 'đźŚż' },
                { id: 'git_commit', name: 'Git commit hash', code: '\\d{+$(git rev-parse --short HEAD 2>/dev/null)}', preview: 'a1b2c3d', icon: 'đź”—' },
                { id: 'git_repo', name: 'Git repository name', code: '\\d{+$(basename $(git rev-parse --show-toplevel) 2>/dev/null)}', preview: 'bash-generator', icon: 'đź“¦' },
                { id: 'git_status', name: 'Git status (clean / dirty)', code: '\\d{+$([ -z $(git status -s 2>/dev/null) ] && echo "âś“" || echo "âś—")}', preview: 'âś“', icon: 'đź”„' },
                { id: 'git_staged', name: 'Git staged files count', code: '\\d{+$(git diff --cached --name-only 2>/dev/null | wc -l)}', preview: '2', icon: 'đź“ť' }
            ],
            'Development Environments': [
                { id: 'python_venv', name: 'Python virtual environment', code: '\\d{+${VIRTUAL_ENV##*/}}', preview: 'venv', icon: 'đźŤ' },
                { id: 'node_version', name: 'Node.js version', code: '\\d{+$(node -v 2>/dev/null)}', preview: 'v18.12.0', icon: 'â¬˘' },
                { id: 'ruby_version', name: 'Ruby version', code: '\\d{+$(ruby -v 2>/dev/null | cut -d\' \' -f2)}', preview: '3.1.2', icon: 'đź’Ž' },
                { id: 'go_version', name: 'Go version', code: '\\d{+$(go version 2>/dev/null | cut -d\' \' -f3)}', preview: 'go1.19', icon: 'đźą' },
                { id: 'docker_context', name: 'Docker context', code: '\\d{+$(docker context show 2>/dev/null)}', preview: 'default', icon: 'đźł' },
                { id: 'k8s_context', name: 'Kubernetes context', code: '\\d{+$(kubectl config current-context 2>/dev/null)}', preview: 'minikube', icon: 'â¸ď¸Ź' }
            ],
            'System Status': [
                { id: 'cpu_usage', name: 'CPU usage', code: '\\d{+$(top -bn1 | grep "Cpu(s)" | cut -d\'%\' -f1 | rev | cut -d\' \' -f1 | rev)}', preview: '12%', icon: 'đź“' },
                { id: 'memory_usage', name: 'Memory usage', code: '\\d{+$(free | grep Mem | awk \'{printf("%.0f%%", $3/$2 * 100.0)}\')  }', preview: '45%', icon: 'đź’ľ' },
                { id: 'disk_usage', name: 'Disk usage', code: '\\d{+$(df -h / | tail -1 | awk \'{print $5}\')}', preview: '32%', icon: 'đź’ż' },
                { id: 'load_avg', name: 'Load average', code: '\\d{+$(uptime | cut -d\':\' -f5)}', preview: '0.45, 0.32, 0.28', icon: 'âš–ď¸Ź' },
                { id: 'uptime', name: 'Uptime', code: '\\d{+$(uptime -p)}', preview: 'up 2 days, 3 hours', icon: 'âŹł' }
            ],
            'Network': [
                { id: 'local_ip', name: 'Local IP address', code: '\\d{+$(hostname -I | cut -d\' \' -f1)}', preview: '192.168.1.100', icon: 'đźŚ' },
                { id: 'public_ip', name: 'Public IP address', code: '\\d{+$(curl -s https://ifconfig.me)}', preview: '203.0.113.42', icon: 'đźŚŤ' },
                { id: 'ssh_indicator', name: 'SSH session indicator', code: '\\d{+${SSH_CONNECTION:+ssh}}', preview: 'ssh', icon: 'đź”' },
                { id: 'network_iface', name: 'Current network interface', code: '\\d{+$(ip route | grep default | awk \'{print $5}\')}', preview: 'eth0', icon: 'đź”Ś' }
            ],
            'Layout': [
                { id: 'newline', name: 'New line', code: '\\n', preview: 'â†µ', icon: 'âŹŽ' },
                { id: 'carriage_return', name: 'Carriage return', code: '\\r', preview: 'âŹŽ', icon: 'â†©ď¸Ź' },
                { id: 'space', name: 'Space', code: ' ', preview: ' ', icon: 'âŁ' },
                { id: 'tab', name: 'Tab', code: '\\t', preview: '[tab]', icon: 'â†’' }
            ],
            'Characters': [
                { id: 'bell', name: 'Bell / beep', code: '\\a', preview: 'đź””', icon: 'đź”Š' },
                { id: 'escape', name: 'Escape character', code: '\\e', preview: 'ESC', icon: 'âťŚ' },
                { id: 'backslash', name: 'Backslash character', code: '\\\\', preview: '\\\\', icon: '\\' },
                { id: 'pipe', name: 'Pipe character', code: '|', preview: '|', icon: 'âś‚ď¸Ź' }
            ],
            'Formatting': [
                { id: 'non_print_start', name: 'Start non-printing', code: '\\[', preview: '[', icon: 'đź“Ť' },
                { id: 'non_print_end', name: 'End non-printing', code: '\\]', preview: ']', icon: 'đźš©' },
                { id: 'text_color', name: 'Text color', code: '\\e[35m', preview: 'Color', icon: 'đźŽ¨' },
                { id: 'bg_color', name: 'Background color', code: '\\e[45m', preview: 'BG', icon: 'đźŽ­' },
                { id: 'bold', name: 'Bold text', code: '\\e[1m', preview: 'Bold', icon: '**' },
                { id: 'dim', name: 'Dim text', code: '\\e[2m', preview: 'Dim', icon: '///' },
                { id: 'underline', name: 'Underline', code: '\\e[4m', preview: 'Under', icon: '__' },
                { id: 'blink', name: 'Blink', code: '\\e[5m', preview: 'Blink', icon: 'đź’«' },
                { id: 'reset', name: 'Reset formatting', code: '\\e[0m', preview: 'Reset', icon: 'âšŞ' }
            ],
            'Icons / Symbols': [
                { id: 'git_icon', name: 'Git icon', code: '', preview: '', icon: 'đźŚż' },
                { id: 'folder_icon', name: 'Folder icon', code: 'đź“', preview: 'đź“', icon: 'đź“‚' },
                { id: 'user_icon', name: 'User icon', code: 'đź‘¤', preview: 'đź‘¤', icon: 'đź§‘' },
                { id: 'host_icon', name: 'Host icon', code: 'đź–Ąď¸Ź', preview: 'đź–Ąď¸Ź', icon: 'đźŚ' },
                { id: 'time_icon', name: 'Time icon', code: 'đź•', preview: 'đź•', icon: 'âŹ°' },
                { id: 'error_icon', name: 'Error icon', code: 'âťŚ', preview: 'âťŚ', icon: 'âš ď¸Ź' },
                { id: 'success_icon', name: 'Success icon', code: 'âś…', preview: 'âś…', icon: 'âś”ď¸Ź' }
            ]
        };

        const SPECIAL_CHARS = [
            { char: 'Space', code: ' ', priority: 1 },
            { char: '~', code: '~', priority: 2 },
            { char: '!', code: '!', priority: 3 },
            { char: '?', code: '?', priority: 4 },
            { char: '@', code: '@', priority: 5 },
            { char: '#', code: '#', priority: 6 },
            { char: '$', code: '$', priority: 7 },
            { char: '%', code: '%', priority: 8 },
            { char: '^', code: '^', priority: 9 },
            { char: '&', code: '&', priority: 10 },
            { char: '*', code: '*', priority: 11 },
            { char: '(', code: '(', priority: 12 },
            { char: ')', code: ')', priority: 13 },
            { char: '{', code: '{', priority: 14 },
            { char: '}', code: '}', priority: 15 },
            { char: '[', code: '[', priority: 16 },
            { char: ']', code: ']', priority: 17 },
            { char: '-', code: '-', priority: 18 },
            { char: '_', code: '_', priority: 19 },
            { char: '+', code: '+', priority: 20 },
            { char: '=', code: '=', priority: 21 },
            { char: '/', code: '/', priority: 22 },
            { char: '\\', code: '\\', priority: 23 },
            { char: '|', code: '|', priority: 24 },
            { char: ',', code: ',', priority: 25 },
            { char: '.', code: '.', priority: 26 },
            { char: ':', code: ':', priority: 27 },
            { char: ';', code: ';', priority: 28 },
            { char: '"', code: '"', priority: 29 },
            { char: "'", code: "'", priority: 30 },
            { char: '<', code: '<', priority: 31 },
            { char: '>', code: '>', priority: 32 }
        ];

        // Sample preview data
        const PREVIEW_DATA = {
            'date': '2026-03-08',
            'time24h': '14:30:45',
            'time12h': '02:30 PM',
            'username': 'neiki',
            'hostname': 'mypc',
            'pwd': '/home/neiki/projects',
            'git_branch': 'main',
            'exit_status': '0'
        };

