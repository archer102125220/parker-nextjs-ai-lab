autoload -U add-zsh-hook

# 保存當前目錄
save_current_dir() {
  export PREV_DIR="$PWD"
}

# 檢查並切換 Node.js 版本
load-nvmrc() {
  local nvmrc_path="$(nvm_find_nvmrc)"
  local current_dir="$PWD"

  if [ -n "$nvmrc_path" ]; then
    local nvmrc_node_version=$(nvm version "$(cat "${nvmrc_path}")")

    if [ "$nvmrc_node_version" = "N/A" ]; then
      nvm install
    elif [ "$nvmrc_node_version" != "$(nvm version)" ]; then
      nvm use
    fi
  elif [ -n "$PREV_DIR" ] && [ -f "$PREV_DIR/.nvmrc" ] && [ ! -f "$PWD/.nvmrc" ]; then
    nvm use default
  fi
}

# 添加鉤子
add-zsh-hook chpwd check_dir_change
add-zsh-hook precmd save_current_dir
add-zsh-hook chpwd load-nvmrc 
load-nvmrc
