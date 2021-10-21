1. Add `json_formatter.rb` to `lib/simple_cov/formatter`
2. Update `spec_helper.rb`
```
    require 'json'
    require_relative '../../lib/simple_cov/formatter/json_formatter'

    SimpleCov.formatter = SimpleCov::Formatter::JsonFormatter
    SimpleCov.start do
    enable_coverage :branch
    end
```
3. Add `coverage_rails.sh` to `script`
4. Add `coverage_rails.sh` reference to `script/pre-push.sh` script