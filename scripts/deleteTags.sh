#!/bin/bash

git fetch --tag
git tag -l | xargs -n 1 git push --delete origin
git tag -l | xargs -n 1 git tag -d