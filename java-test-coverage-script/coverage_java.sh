command -v xmllint >/dev/null 2>&1 || { echo >&2 "I require jq but it's not installed.\nBrew: brew install xmllint\nAPT: sudo apt-get install xmllint\n  Aborting."; exit 1; }

IGNORE_CONFLICT_FILE=$PWD/ignore-conflict/.gitattributes
RESULT_COVERAGE_FILE=$PWD/code_coverage.json
COVERAGE_REPORT_FILE=$PWD/target/reports/jacoco/jacoco.xml

if [ ! -f $IGNORE_CONFLICT_FILE ]; then
    mkdir ./ignore-conflict
    fileContent="${RESULT_COVERAGE_FILE} merge=ours";
    echo $fileContent >> $IGNORE_CONFLICT_FILE
    git config merge.ours.driver true
fi

    
if [ -f $COVERAGE_REPORT_JSON_FILE ]; then
    missed_lines=$(xmllint --xpath '//report/counter[@type="LINE"]/@missed' ${COVERAGE_REPORT_FILE} | awk -F'[="]' '!/>/{print $(NF-1)}')
    covered_lines=$(xmllint --xpath '//report/counter[@type="LINE"]/@covered' ${COVERAGE_REPORT_FILE} | awk -F'[="]' '!/>/{print $(NF-1)}')
    total_lines=$((missed_lines + covered_lines))
    line_coverage=$(echo "scale=2 ; $covered_lines / $total_lines" | bc)
    

    missed_branches=$(xmllint --xpath '//report/counter[@type="BRANCH"]/@missed' ${COVERAGE_REPORT_FILE} | awk -F'[="]' '!/>/{print $(NF-1)}')
    covered_branches=$(xmllint --xpath '//report/counter[@type="BRANCH"]/@covered' ${COVERAGE_REPORT_FILE} | awk -F'[="]' '!/>/{print $(NF-1)}')
    total_branches=$((missed_branches + covered_branches))
    branch_coverage=$(echo "scale=2 ; $covered_branches / $total_branches" | bc)

    echo "{\"lines\": ${line_coverage}, \"branches\": ${branch_coverage}}" > $RESULT_COVERAGE_FILE
fi