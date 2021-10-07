command -v jq >/dev/null 2>&1 || { echo >&2 "I require jq but it's not installed.\nBrew: brew install jq\nAPT: sudo apt-get install jq\n  Aborting."; exit 1; }

IGNORE_CONFLICT_FILE=$PWD/ignore-conflict/.gitattributes
RESULT_COVERAGE_FILE=$PWD/code_coverage.json
COVERAGE_REPORT_JSON_FILE=$PWD/coverage/coverage.json

if [ ! -f $IGNORE_CONFLICT_FILE ]; then
    mkdir ./ignore-conflict
    fileContent="${RESULT_COVERAGE_FILE} merge=ours";
    echo $fileContent >> $IGNORE_CONFLICT_FILE
    git config merge.ours.driver true
fi

    
if [ -f $COVERAGE_REPORT_JSON_FILE ]; then
    lines=$(jq .metrics.coverage_statistics.line.percent $COVERAGE_REPORT_JSON_FILE)
    branches=$(jq .metrics.coverage_statistics.branch.percent $COVERAGE_REPORT_JSON_FILE)
    lines = $(echo "scale=4 ; $lines / 100" | bc)
    branches = $(echo "scale=4 ; $branches / 100" | bc)

    echo "{\"lines\": ${lines}, \"branches\": ${branches}}" > $RESULT_COVERAGE_FILE
fi
