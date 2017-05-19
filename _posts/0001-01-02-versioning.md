---
title: Versioning
id: versioning
---

The specification is versioned based on `major.minor` notation. The `major` version will be incremented with any technical change to the specification format or way it should be interpreted. Changes to the `minor` version will be reserved for any clarification or correction of clerical errors associated with the specification language.

The `major` version in the specification name is synonymous with the `version` field in a Mapbox Vector Tile layer. See the `3.1. Layers` section for more details.

Current version: **2.1**

Brief changelog history

**Version** | **Date of release** | **Updates**
**`2.1`** | January 19th, 2016| Correction to the wording in a few locations of the 2.0 specification.
**`2.0`** | December 4th, 2015 | The focus of version `2.0` of the Mapbox Vector Tile specification is the clarification of the intent of the intial version of the specification and the definition of interior and exterior rings within polygons. The fields within the protobuffer are more clearly defined in this version of the specification and the steps for decoders and encoders are more explicity declared.
**`1.0.1`** | July 28, 2014 | Update `.proto` file to match Protobuf style guide, changed namespace
**`1.0.0`** | April 13, 2014 | First release