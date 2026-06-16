# Add this to ~/.zshrc
# if [ -f "$HOME/projects/senaev-laptop-settings/zsh/utils.sh" ]; then
#   source "$HOME/projects/senaev-laptop-settings/zsh/utils.sh"
# fi


plugins=(git docker kubectl sudo history zsh-autosuggestions zsh-syntax-highlighting)
ZSH_THEME=""

alias 'm=git add .;git commit -m "@andrei.senaev default message";git push'
alias 'main=git checkout main;git pull'
function pr() {
    local BRANCH=$(git rev-parse --abbrev-ref HEAD)
    open https://github.com/DataDog/web-ui/compare/preprod...$BRANCH
}


alias 'web-ui=cd /Users/andrei.senaev/go/src/github.com/DataDog/web-ui'
alias 'preprod=git checkout preprod;git pull'

export DOCKER_HOST="unix://$HOME/.colima/default/docker.sock"
export TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE=/var/run/docker.sock

function checkout() {
  if [[ $# -ne 2 ]]; then
    echo "Usage: ch <task-name> <branch-name>" >&2
    return 1
  fi

  local task_name="$1"
  local branch_name="$2"

  if [[ ! "$task_name" =~ "^[A-Z][A-Z0-9]+-[0-9]+$" ]]; then
    echo "Invalid task name: $task_name (expected format: LOGSAC-1538)" >&2
    return 1
  fi

  if [[ ! "$branch_name" =~ "^[a-z0-9]+(-[a-z0-9]+)*$" ]]; then
    echo "Invalid branch name: $branch_name (use lowercase kebab-case, e.g. create-new-feature)" >&2
    return 1
  fi

  local full_branch="andrei.senaev/$task_name/$branch_name"

  if ! git check-ref-format --branch "$full_branch" >/dev/null 2>&1; then
    echo "Invalid git branch name: $full_branch" >&2
    return 1
  fi

  git checkout -b "$full_branch"
}

function commit() {
  if [[ $# -eq 0 ]]; then
    echo "Usage: commit <message>" >&2
    return 1
  fi

  local message="$*"

  if [[ -z "${message//[[:space:]]/}" ]]; then
    echo "Commit message cannot be empty" >&2
    return 1
  fi

  local branch_name
  branch_name=$(git rev-parse --abbrev-ref HEAD) || return 1

  if [[ "$branch_name" != andrei.senaev/* ]]; then
    echo "Current branch must start with andrei.senaev/: $branch_name" >&2
    return 1
  fi

  local ticket_name="${branch_name#andrei.senaev/}"
  ticket_name="${ticket_name%%/*}"

  if [[ ! "$ticket_name" =~ "^[A-Z][A-Z0-9]+-[0-9]+$" ]]; then
    echo "Could not parse ticket name from branch: $branch_name" >&2
    return 1
  fi

  if git diff --cached --quiet; then
    echo "No staged changes to commit" >&2
    return 1
  fi

  git commit -m "$ticket_name: $message"
}
