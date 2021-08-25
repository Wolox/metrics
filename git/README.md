# GIT metrics

A utility to calculate GIT metrics.

## Installation

To install the package:

```bash
npm install @wolox/git-metrics
```

## Usage

This package returns a single function. This function is a sort of factory that given a provider and a authToken will return the metric fetcher generator. 

### Parameters

```js
const gitMetrics = require('git-metrics');

const accessToken = 'a valid access token from your provider'
const getGithubMetrics = gitMetrics('github', accessToken);

getGithubMetrics(repositoryName, organizationName).then(metrics => {
  // Use or save your metrics
});

```

- Default export (`gitMetrics`) in the example above

|Parameter|Description|
|----|-----------|
|provider|The git provider. For the time being we only support `github` and `gitlab`|
|authToken|A personal access token to obtain data from the provider. For github it must have full `repo` permissions, while for `gitlab` it must have `read_api` permissions|

- Default export's return value (`getGithubMetrics` in the example)

|Parameter|Description|
|----|-----------|
|repositoryName|The git repository's name|
|organizationName|For `github`, this must be the organization's name, but for `gitlab` this must be the repository's whole path with namespace, but without the repository name. For example, if your repo's path is `google/google-drive/google-sheets` this parameter should be `google/google-drive`|

### Return value

The return value consists of a list of the PRs that were closed in the last 14 days. Each with their respective pick up time and code review time.

```js
[
  { 
    review_time: 20
    pick_up_time: 10
  },
  { 
    review_time: 5
    pick_up_time: 2
  }
]
```

For the time being we support the following metrics:

- `review_time`: Time (in hours) between the PR/MR is created and merged
- `pick_up_time`: Time (in hours) between the PR/MR is created and it's first reviewed

**Note**: Metric values can return `undefined`. You should handle that scenario on your own.

## Licence

Copyright 2021 Wolox

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

