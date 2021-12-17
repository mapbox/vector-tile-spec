# Mapbox Vector Tile Specification

A specification for encoding tiled vector data.

## License

The text of this specification is licensed under a
[Creative Commons Attribution 3.0 United States License](http://creativecommons.org/licenses/by/3.0/us/).
However, the use of this spec in products and code is entirely free:
there are no royalties, restrictions, or requirements.

## [Implementations](https://github.com/mapbox/awesome-vector-tiles)

## Versioning

The Mapbox Vector Tile Specification is versioned based on `major.minor` notation. The `major` version will be incremented with any technical change to the specification format or way it should be interpreted. Changes to the `minor` version will be reserved for any clarification or correction of clerical errors associated with the specification language.

The `major` version in the specification name is synonymous with the `version` field in a Mapbox Vector Tile layer. See the [Layers](https://github.com/mapbox/vector-tile-spec/tree/master/2.1#41-layers) section of the Vector Tile Specification for more details.

**Version** | **Date&nbsp;of&nbsp;release** | **Updates**
-|-|-
**`2.1`** | January 19, 2016| Correction to the wording in a few locations of the 2.0 specification.
**`2.0`** | December 4, 2015 | The focus of version 2.0 of the Mapbox Vector Tile specification is the clarification of the intent of the intial version of the specification and the definition of interior and exterior rings within polygons. The fields within the protobuffer are more clearly defined in this version of the specification and the steps for decoders and encoders are more explicity declared.
**`1.0.1`** | July 28, 2014 | Update `.proto` file to match [Protocol Buffer style guide](https://developers.google.com/protocol-buffers/docs/style), changed namespace
**`1.0.0`** | April 13, 2014 | First release

## Contributing

If you are interested in contributing please refer to the [CONTRIBUTING.md](CONTRIBUTING.md) file.

## Authors

* Vladimir Agafonkin
* John Firebaugh
* Eric Fischer
* Konstantin Käfer
* Charlie Loyd
* Tom MacWright
* Artem Pavlenko
* Dane Springmeyer
* Blake Thompson

## Translations

* [简体中文](https://github.com/jingsam/vector-tile-spec/blob/master/2.1/README_zh.md)
* [日本語](https://github.com/madefor/vector-tile-spec/blob/master/2.1/README.md)
