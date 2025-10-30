# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] 2025-10-30

### Changes

- added `suppressWarnings` option to `CommandRegister` constructor
- `CommandRegister` constructor now throws an error if created multiple times

## [0.1.1] 2025-10-26

### Fixed

- duplicate `Enum` parameters are now ignored instead of causing errors

## [0.1.0] 2025-10-25

### Added

- `defineParameter` function
- `defineCommand` function
- `CommandRegister` class