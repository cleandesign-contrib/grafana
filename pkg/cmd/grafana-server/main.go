package main

import (
	"os"

	"github.com/grafana/grafana/pkg/cmd/grafana-server/commands"

	// TODO(sh0rez): remove once import cycle resolved
	_ "github.com/grafana/grafana/pkg/web/hack"
)

// The following variables cannot be constants, since they can be overridden through the -X link flag
var version = "7.5.0"
var commit = "NA"
var buildBranch = "main"
var buildstamp string

func main() {
	os.Exit(commands.RunServer(commands.ServerOptions{
		Version:     version,
		Commit:      commit,
		BuildBranch: buildBranch,
		BuildStamp:  buildstamp,
	}))
}
