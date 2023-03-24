{ pkgs }: {
  deps = [
    pkgs.nodejs-16_x
    pkgs.nodejs-16_x
    pkgs.yarn
    pkgs.yarn
    pkgs.yarn -ver
    pkgs.nodePackages.vscode-langservers-extracted
    pkgs.nodePackages.typescript-language-server  
  ];
}