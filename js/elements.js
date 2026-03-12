// Element Definitions
const ELEMENT_CATEGORIES = {
    'Date & Time': [
        { id: 'date', name: 'Date', code: '\\D{%Y-%m-%d}', preview: '2026-03-08', icon: 'DATE' },
        { id: 'custom_date', name: 'Custom date / time', code: '\\D{%Y-%m-%d %H:%M:%S}', preview: '2026-03-08 14:30:45', icon: 'DT' },
        { id: 'time24h', name: 'Time (24-hour)', code: '\\t', preview: '\\t', icon: 'T24' },
        { id: 'time12h', name: 'Time (12-hour)', code: '\\D{%I:%M %p}', preview: '02:30 PM', icon: 'T12' },
        { id: 'time_ampm', name: 'Time (AM/PM)', code: '\\D{%p}', preview: 'PM', icon: 'AMPM' },
        { id: 'time_no_sec', name: 'Time (24h no seconds)', code: '\\D{%H:%M}', preview: '14:30', icon: 'HM' },
        { id: 'unix_time', name: 'Unix timestamp', code: '\\D{%s}', preview: '1741414245', icon: 'UNIX' },
        { id: 'timezone', name: 'Time zone', code: '\\D{%Z}', preview: 'CET', icon: 'TZ' }
    ],
    'User': [
        { id: 'username', name: 'Username', code: '\\u', preview: 'neiki', icon: 'USR' },
        { id: 'user_root', name: 'User / Root indicator', code: '\\#', preview: '$', icon: 'ROOT' },
        { id: 'uid', name: 'User ID', code: '\\$(id -u)', preview: '1000', icon: 'UID' }
    ],
    'Host & System': [
        { id: 'hostname_short', name: 'Hostname (short)', code: '\\h', preview: 'mypc', icon: 'HOST' },
        { id: 'hostname_full', name: 'Hostname (full)', code: '\\H', preview: 'mypc.example.com', icon: 'HOSTF' },
        { id: 'shell_name', name: 'Shell name', code: '\\l', preview: 'pts/0', icon: 'TTY' },
        { id: 'bash_version', name: 'Bash version', code: '\\${BASH_VERSION%.*}', preview: '5.2', icon: 'BASH' },
        { id: 'bash_full', name: 'Bash version (full)', code: '\\${BASH_VERSION}', preview: '5.2.21', icon: 'BASHF' },
        { id: 'terminal', name: 'Terminal device', code: '\\l', preview: 'pts/1', icon: 'TERM' },
        { id: 'shell_level', name: 'Shell level', code: '\\${SHLVL}', preview: '1', icon: 'SHLVL' }
    ],
    'Directory': [
        { id: 'pwd_full', name: 'Current directory (full path)', code: '\\w', preview: '/home/neiki/projects', icon: 'PWD' },
        { id: 'pwd_name', name: 'Current directory (folder name)', code: '\\W', preview: 'projects', icon: 'DIR' },
        { id: 'pwd_home', name: 'Path with home shortcut', code: '\\${PWD/#$HOME/~}', preview: '~/projects', icon: 'HOME' },
        { id: 'pwd_prev', name: 'Previous directory', code: '\\${OLDPWD/#$HOME/~}', preview: '~/documents', icon: 'OLDPWD' },
        { id: 'pwd_depth', name: 'Directory depth', code: '\\$(pwd | tr -cd / | wc -c)', preview: '3', icon: 'DEPTH' }
    ],
    'Commands & History': [
        { id: 'history_num', name: 'Command history number', code: '\\!', preview: '245', icon: 'HIST' },
        { id: 'cmd_num', name: 'Command number in session', code: '\\#', preview: '42', icon: 'CMD' },
        { id: 'exit_status', name: 'Last command exit status', code: '\\$?', preview: '0', icon: 'STS' },
        { id: 'success_indicator', name: 'Success indicator', code: '\\$([ $? -eq 0 ] && echo "OK" || echo "ERR")', preview: 'OK', icon: 'OK' },
        { id: 'error_indicator', name: 'Error indicator', code: '\\$([ $? -ne 0 ] && echo "ERR" || echo "OK")', preview: 'ERR', icon: 'ERR' }
    ],
    'Processes': [
        { id: 'bg_jobs', name: 'Background jobs count', code: '\\$(jobs -r | wc -l)', preview: '0', icon: 'JOB' },
        { id: 'shell_pid', name: 'Shell process ID', code: '\\$$', preview: '12545', icon: 'PID' },
        { id: 'parent_pid', name: 'Parent process ID', code: '\\${PPID}', preview: '12544', icon: 'PPID' },
        { id: 'running_procs', name: 'Running processes count', code: '\\$(ps -e --no-headers | wc -l)', preview: '145', icon: 'PROC' }
    ],
    'Version Control': [
        { id: 'git_branch', name: 'Git branch', code: '\\$(git branch --show-current 2>/dev/null)', preview: 'main', icon: 'GIT' },
        { id: 'git_commit', name: 'Git commit hash', code: '\\$(git rev-parse --short HEAD 2>/dev/null)', preview: 'a1b2c3d', icon: 'COMMIT' },
        { id: 'git_repo', name: 'Git repository name', code: '\\$(basename $(git rev-parse --show-toplevel) 2>/dev/null)', preview: 'bash-generator', icon: 'REPO' },
        { id: 'git_status', name: 'Git status (clean / dirty)', code: '\\$([ -z "$(git status -s 2>/dev/null)" ] && echo "OK" || echo "DIRTY")', preview: 'OK', icon: 'STATUS' },
        { id: 'git_staged', name: 'Git staged files count', code: '\\$(git diff --cached --name-only 2>/dev/null | wc -l)', preview: '2', icon: 'STAGED' }
    ],
    'Development Environments': [
        { id: 'python_venv', name: 'Python virtual environment', code: '\\${VIRTUAL_ENV##*/}', preview: 'venv', icon: 'PY' },
        { id: 'node_version', name: 'Node.js version', code: '\\$(node -v 2>/dev/null)', preview: 'v18.12.0', icon: 'NODE' },
        { id: 'ruby_version', name: 'Ruby version', code: '\\$(ruby -v 2>/dev/null | cut -d" " -f2)', preview: '3.1.2', icon: 'RUBY' },
        { id: 'go_version', name: 'Go version', code: '\\$(go version 2>/dev/null | cut -d" " -f3)', preview: 'go1.19', icon: 'GO' },
        { id: 'docker_context', name: 'Docker context', code: '\\$(docker context show 2>/dev/null)', preview: 'default', icon: 'DOCKER' },
        { id: 'k8s_context', name: 'Kubernetes context', code: '\\$(kubectl config current-context 2>/dev/null)', preview: 'minikube', icon: 'K8S' }
    ],
    'Network': [
        { id: 'local_ip', name: 'Local IP address', code: '\\$(hostname -I 2>/dev/null | awk "{print $1}")', preview: '192.168.1.100', icon: 'IP' },
        { id: 'public_ip', name: 'Public IP address', code: '\\$(curl -s https://ifconfig.me)', preview: '203.0.113.42', icon: 'PUBIP' },
        { id: 'ssh_indicator', name: 'SSH session indicator', code: '\\${SSH_CONNECTION:+ssh}', preview: 'ssh', icon: 'SSH' },
        { id: 'network_iface', name: 'Current network interface', code: '\\$(ip route show default 2>/dev/null | awk "NR==1{print $5}")', preview: 'eth0', icon: 'IFACE' }
    ],
    'Layout': [
        { id: 'newline', name: 'New line', code: '\\n', preview: '[NL]', icon: 'NL' },
        { id: 'carriage_return', name: 'Carriage return', code: '\\r', preview: '[CR]', icon: 'CR' },
        { id: 'space', name: 'Space', code: ' ', preview: ' ', icon: 'SP' },
        { id: 'tab', name: 'Tab', code: '\\t', preview: '[TAB]', icon: 'TAB' }
    ],
    'Characters': [
        { id: 'bell', name: 'Bell / beep', code: '\\a', preview: '[BELL]', icon: 'BELL' },
        { id: 'escape', name: 'Escape character', code: '\\e', preview: 'ESC', icon: 'ESC' },
        { id: 'backslash', name: 'Backslash character', code: '\\\\', preview: '\\\\', icon: 'BS' },
        { id: 'pipe', name: 'Pipe character', code: '|', preview: '|', icon: 'PIPE' }
    ],
    'Formatting': [
        { id: 'non_print_start', name: 'Start non-printing', code: '\\[', preview: '[', icon: 'NP1' },
        { id: 'non_print_end', name: 'End non-printing', code: '\\]', preview: ']', icon: 'NP2' },
        { id: 'text_color', name: 'Text color', code: '\\e[35m', preview: 'Color', icon: 'FG' },
        { id: 'bg_color', name: 'Background color', code: '\\e[45m', preview: 'BG', icon: 'BG' },
        { id: 'bold', name: 'Bold text', code: '\\e[1m', preview: 'Bold', icon: 'B' },
        { id: 'dim', name: 'Dim text', code: '\\e[2m', preview: 'Dim', icon: 'D' },
        { id: 'underline', name: 'Underline', code: '\\e[4m', preview: 'Under', icon: 'U' },
        { id: 'blink', name: 'Blink', code: '\\e[5m', preview: 'Blink', icon: 'BLK' },
        { id: 'reset', name: 'Reset formatting', code: '\\e[0m', preview: 'Reset', icon: 'RST' }
    ],
    'Icons / Symbols': [
        { id: 'git_icon', name: 'Git icon', code: '[GIT]', preview: '[GIT]', icon: 'GIT' },
        { id: 'folder_icon', name: 'Folder icon', code: '[DIR]', preview: '[DIR]', icon: 'DIR' },
        { id: 'user_icon', name: 'User icon', code: '[USR]', preview: '[USR]', icon: 'USR' },
        { id: 'host_icon', name: 'Host icon', code: '[HOST]', preview: '[HOST]', icon: 'HOST' },
        { id: 'time_icon', name: 'Time icon', code: '[TIME]', preview: '[TIME]', icon: 'TIME' },
        { id: 'error_icon', name: 'Error icon', code: '[ERR]', preview: '[ERR]', icon: 'ERR' },
        { id: 'success_icon', name: 'Success icon', code: '[OK]', preview: '[OK]', icon: 'OK' }
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
    date: '2026-03-08',
    time24h: '14:30:45',
    time12h: '02:30 PM',
    username: 'neiki',
    hostname: 'mypc',
    pwd: '/home/neiki/projects',
    git_branch: 'main',
    exit_status: '0'
};
