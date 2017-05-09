# Dockerised repo for loading GP profile data into a MongoDB container

## Merging data from multiple sources

Currently there are 2 sources of data:
* GP data from the NHSChoices syndication feed. Handled by
  [gp-data-etl](https://github.com/nhsuk/gp-data-etl)
* Patient Online Management Information (POMI) data from NHSDigital's indicator
  portal. Handled by [pomi-data-etl](https://github.com/nhsuk/pomi-data-etl)

The output from each process is added to `./input`. Executing `yarn start` will
create a merged data set and save it in `./data` from where it will be loaded
into the database. This happens during the CI build and the merged data set
will be included in the generated docker image.

## Data structure

An example of the structure of the data stored in MongoDB can be found in the
[Sample GP Data](sample-gp-data.json)

The more interesting members are described below:

### Display name

`displayName` contains the `name` member  adjusted to title case in an attempt
to fix names that have been entered in all capitals.

### Address

The `address` member consists of an array of `addressLines` and a `postcode`.
The member is always present and there will always be a `postcode` and at least
one `addressLine`.

### Location

The `location` member is a GeoJSON object. It consists of a `type` member that
is always `Point`, and a `coordinates` member that is an array of two numbers.
The first number is the `longitude`, the second number is the `latitude`. These
members are always populated.

### Contact

The `contact` member may include `telephone`, `fax`, `website`, or `email`. The
`contact` member is always present, but all sub-members are optional.
`website` will always have a protocol.

### Opening times

The `openingTimes` member may contain a `reception`, `surgery` and `alteration`
sub-member.

The `reception` and `surgery` members themselves have members `sunday`,
`monday`, `tuesday`, `wednesday`, `thursday`, `friday` and `saturday`. If a
`reception` and `surgery` member exists, all of the days of the week will be
populated.

A day member will contain an array of objects with `open` and `closes` members.
An empty array means it is not open that day. The `open` and `closes` times are
strings in the 24 hour format, i.e. `18:30`.

The `alteration` sub-object contains members for each date the practice opening
hours change from the standard. The date in the format `yyyy-MM-dd`, i.e.
`2017-12-25`. The array of objects contained in the member is the same
structure as the day member above.

The `openingTimes` member is optional, as are the `reception`, `surgery` and
`alteration` sub-members.

### GP counts

The `gpCounts` members will either contain both a `male` and `female` member,
or a single `unknown` member, never all three. The member will always be
present, and the sub-members will always contain a number.

### Doctors

The `doctors` member is always present and contains an array of strings. It may
be an empty array.

### Accepting new patients

The `acceptingNewPatients` member is always present and will contain `true` or
`false`.

---

### Online Services

The `onlineServices` member is always present, however, the contents of it are
optional. Optional members of `onlineServices` are:

#### Repeat Prescriptions

`repeatPrescriptions` is an optional member of `onlineServices`. When
present it will contain an object consisting of a `supplier` member and an
optional `url` member (see below for more information on `supplier`).

#### Coded Records

`codedRecords` is an optional member of `onlineServices`. When
present it will contain an object consisting of a `supplier` member and an
optional `url` member (see below for more information on `supplier`).

#### Appointments

`appointments` is an optional member of `onlineServices`. When
present it will contain an object consisting of a `supplier` member and an
optional `url` member (see below for more information on `supplier`).

##### Supplier

`supplier` is a string, representing the GP's supplier for the type of system
the member represents e.g. repeat prescription ordering system.
The value will be one of the suppliers listed below
`["EMIS","INPS","Informatica","Microtest","NK","TPP"]`. Or one of these values
with an `(I)` appended e.g. `EMIS (I)`. The addition of `(I)` represents a GP
that is now using the Informatica system.
`url` is a string representing the best link we know about to use for
accessing that GP's online system. It will be a direct link to the system or
the GP's website if the system is unknown. And no value is the GP's
website is unknown.

---

### Facilities

The `facilities` member may contain `parking` or `accessibility` members. Each
of these members holds an array of objects with properties `name` and `exists`.
The `facilities` member is optional, as are the child members. When a child
member is present it will always contain at least one item, and the `name` and
`exists` members are always populated.

### Services

The `services` member is optional and may contain the members `epsEnabled`,
`moreInformaton`, or `entries`.  `epsEnabled` is optional and will be `true` if
the practice provides the Electronic Prescription Service.
`moreInformation` is optional free text.

The `entries` array is always present and contains objects with members
`title`, `code`, `availabilityTimes`, `introduction`, `gpReferralRequired` and
`deliverer`.  `code` is the unique id within Syndication for that particular
service type, i.e an `Asthma Clinic` is always `SVR0208` for all practices.
`availabilityTimes` is free text to hold any additional availability times
information.  `gpReferralRequired` will be either `true` or `false`.
`availabilityTimes` and `introduction` are optional.
All other members will be present and populated.

## Interrogating the json with [jq](https://stedolan.github.io/jq/)

* List suppliers: `jq -c 'unique_by(.Supplier) | [.[].Supplier]' input/pomi.json`
* Find single item by `odsCode`:
  `jq '.[] | select(.odsCode == "${odsCode}")' data/gp-data-merged.json`

## Environment variables

Environment variables are expected to be managed by the environment in which
the application is being run. This is best practice as described by
[twelve-factor](https://12factor.net/config).

| Variable                         | Description                                                        | Default               | Required |
|:---------------------------------|:-------------------------------------------------------------------|:----------------------|:---------|
| `NODE_ENV`                       | node environment                                                   | development           |          |
| `LOG_LEVEL`                      | [log level](https://github.com/trentm/node-bunyan#levels)          | Depends on `NODE_ENV` |          |
| `MONGO_HOST`                     | host name on mongo server                                          | mongo                 |          |
| `MONGO_PORT`                     | Port of mongo server                                               | 27017                 |          |
| `MONGO_DB`                       | Mongo database to be updated                                       | profiles              |          |
| `MONGO_COLLECTION`               | Mongo collection to be updated                                     | gps                   |          |
| `CHANGE_THRESHOLD`               | Factor the data count can drop by before erroring                  | 0.95                  |          |
| `UPDATE_SCHEDULE`                | time of day to run the upgrade                                     | 0 7 * * *  (7 am)     |          |
