# 3. Remove mongodb update and write to Azure

Date: 2017-06-21

## Status

Accepted

## Context

The gp-data-merged.json file is required by the Elastic Search to keep [GP Finder](https://github.com/nhsuk/gp-finder) data up to date.

The [mongodb-updater](https://github.com/nhsuk/mongodb-updater) service is able to update a
mongodb database from a JSON file available at a URL.

## Decision

The `gp-data-merged.json` file will be written to the team's preferred cloud hosting platform, Azure,
enabling the merged data to be used as a source for both the `mongodb-updater` and the forthcoming `elasticsearch-updater`.

The mongo database updating code will be removed and an instance of the generic [mongodb-updater](https://github.com/nhsuk/mongodb-updater)
will be configured to update the profiles database from the merged data instead.

The repository will be renamed from `profiles-db-updater` to `profiles-etl-combiner` to reflect the new behaviour.

## Consequences

A `gp-data-merged.json` file will be available in Azure for use by consuming applications.

mongodb updates will be performed by another component, rather than with this repository.

The repository will be renamed.
