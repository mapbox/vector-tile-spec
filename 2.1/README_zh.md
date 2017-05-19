# 矢量瓦片标准

本文档中的“**必须**”、“**必须不**”、“**必备**”、"**应该**"、“**不应该**”、“**建议**”、“**可以**”、“**可选**”的含义参照[RFC 2119](https://www.ietf.org/rfc/rfc2119.txt)。

## 1. 目标

本文档规定了一种节省存储空间的矢量瓦片数据编码格式。这种格式应用于客户端或服务端高效渲染或查询要素信息。

## 2. 文件格式

矢量瓦片文件采用[Google Protocol Buffers](https://developers.google.com/protocol-buffers/)进行编码。Google Protocol Buffers是一种兼容多语言、多平台、易扩展的数据序列化格式。

### 2.1. 文件后缀

矢量瓦片文件的后缀**应该**为`mvt`。例如，`vector.mvt`。

### 2.2 MIME类型

矢量瓦片的MIME类型**应该**设置为`application/vnd.mapbox-vector-tile`。

## 3. 投影和范围

矢量瓦片表示的是投影在正方形区块上的数据。矢量瓦片**不应该**包含范围和投影信息。解码方被假定知道矢量瓦片的范围和投影信息。

[Web Mercator](https://en.wikipedia.org/wiki/Web_Mercator)是默认的投影方式，[Google tile scheme](http://www.maptiler.org/google-maps-coordinates-tile-bounds-projection/)是默认的瓦片编号方式。两者一起完成了与任意范围、任意精度的地理区域的一一对应，例如`https://example.com/17/65535/43602.mvt`。

矢量瓦片**可以**用来表示任意投影方式、任意瓦片编号方案的数据。

## 4. 内部结构

这部分内容描述矢量瓦片的数据结构。读者需要先了解[矢量瓦片protobuf编码方案文件](https://github.com/mapbox/vector-tile-spec/blob/master/2.1%2Fvector_tile.proto)中的结构定义。

### 4.1. 图层

矢量瓦片由一组命名的图层构成。每个图层包含几何要素和元数据信息。设计的图层格式能够保证图层数据能够在内存中按顺序排列，由此在图层组末尾添加一个新的图层就不用更改已有的数据。

每块矢量瓦片**应该**至少包含一个图层。每个图层**应该**至少包含一个要素。

图层**必须**包含一个`version`字段表示此图层所遵守的《矢量瓦片标准》的主版本号。例如，某个图层遵守2.1版本的标准，那么它的`version`字段的值则为整数`2`。`version`字段**应该**设定为图层的第一个字段。解码器**应该**首先解析`version`字段，以确定是否能够解析该版本的图层。当遇到一个未知版本的矢量瓦片图层时，解码器**可以**尝试去解析它，或者**可以**跳过该图层。以上两种情况下，解码器都**应该**继续解析后续的图层。

图层**必须**包含一个`name`字段。每块矢量瓦片**必须不**包含两个或两个以上的图层具有相同`name`值。在向一块矢量瓦片添加一个新的图层之前，编码器**必须**检查已有的`name`值以防止重复。

图层中的每个要素**可以**包含一个或多个key-value作为它的元数据（见下文）。所有要素的key和value被分别索引为两个列表——`keys`和`values`——为图层中的所有要素所共享。

图层`keys`字段的每个元素都是字符串。`keys`字段包含了图层中所有要素的key，并且每个key可以通过它在`keys`列表中的索引号引用，第一个key的索引号是0 。`keys`列表**必须不**包含两个或两个以上key是一样的。

图层`values`字段的每个元素是多种类型的值的编码（见下文）。`values`字段包含了图层中所有要素的value，并且每个value可以通过它在`values`列表中的索引号引用，第一个value的索引号是0 。`values`列表**必须不**包含两个或两个以上value是一样的。

为了支持字符串型、布尔型、整型、浮点型多种类型的值，对`value`字段的编码包含了一组`optional`字段。每个value**必须**包含其中的一个字段。

图层**必须**包含一个`extent`字段，表示瓦片的宽度和高度，以整数表示。矢量瓦片中的几何坐标**可以**超出`extent`定义的范围。超出`extent`范围的几何要素被经常用来作为缓冲区，以渲染重叠在多块相邻瓦片上的要素。

例如，如果一块瓦片的`extent`范围是4096，那么坐标的单位是瓦片长宽的1/4096。坐标0在瓦片的顶部或左边缘，坐标4096在瓦片的底部或右边缘。坐标从1到4095都是在瓦片内部，坐标小于0或者大于4096在瓦片外部。坐标`(1,10)`或`(4095,10)`在瓦片内部。坐标`(0,10)`或`(4096,10)`在瓦片边缘。坐标`(-1,10)`或`(4097,10)`在瓦片外部。

### 4.2. 要素

每个要素**必须**包含一个`geometry`字段。

每个要素**必须**包含一个`type`字段，该字段将在几何类型章节描述（4.3.4）。

每个要素**可以**包含一个`tags`字段。如果存在属于要素级别的元数据，**应该**存储到`tags`字段中。

每个要素**可以**包含一个`id`字段。如果一个要素包含一个`id`字段，那么`id`字段的值**应该**相对于图层中的其他要素是唯一的。

### 4.3. 几何图形编码

矢量瓦片中的几何数据被定义为屏幕坐标系。瓦片的左上角（显示默认如此）是坐标系的原点。X轴向右为正，Y轴向下为正。几何图形中的坐标**必须**为整数。

几何图形被编码为要素的`geometry`字段的一个32位无符号型整数序列。每个整数是`CommandInteger`或者`ParameterInteger`。解码器解析这些整数序列作为生成几何图形的一系列有序操作。

指令涉及到的位置是相对于“游标”的，即一个可重定义的点。对于要素中的第一条指令，游标在坐标系中的位置是`(0,0)`。有些指定能够移动游标，因而会影响到接下来执行的指令。

#### 4.3.1. 指令数

`CommandInteger`指代所要执行的操作和执行的次数，分别以command ID和command count表示。

command ID以`CommandInteger`最末尾的3个比特位表示，即从0到7。command count以`CommandInteger`剩下的29个比特位表示，即`0`到`pow(2, 29) - 1`。

command ID、command count、和`CommandInteger`三者可以通过以下位运算相互转换。

```javascript
CommandInteger = (id & 0x7) | (count << 3)
```

```javascript
id = CommandInteger & 0x7
```

```javascript
count = CommandInteger >> 3
```

每个command ID表示以下指令中的一种：

|  指令        |  Id  | 参数          | 参数个数        |
| ------------ |:----:| ------------- | --------------- |
| MoveTo       | `1`  | `dX`, `dY`    | 2               |
| LineTo       | `2`  | `dX`, `dY`    | 2               |
| ClosePath    | `7`  | 无参数        | 0               |

##### 指令数示例

| 指令      |  ID  | Count | CommandInteger | 二进制表示`[Count][Id]`                  |
| --------- |:----:|:-----:|:--------------:|:----------------------------------------:|
| MoveTo    | `1`  | `1`   | `9`            | `[00000000 00000000 0000000 00001][001]` |
| MoveTo    | `1`  | `120` | `961`          | `[00000000 00000000 0000011 11000][001]` |
| LineTo    | `2`  | `1`   | `10`           | `[00000000 00000000 0000000 00001][010]` |
| LineTo    | `2`  | `3`   | `26`           | `[00000000 00000000 0000000 00011][010]` |
| ClosePath | `7`  | `1`   | `15`           | `[00000000 00000000 0000000 00001][111]` |


#### 4.3.2. 参数数

指令的所有参数紧跟在`ParameterInteger`之后。跟在`CommandInteger`之后的`ParameterIntegers`个数等于指令所需要参数的个数乘以指令执行的次数。例如，一条指示`MoveTo`指令执行3次的`CommandInteger`之后会跟随6个`ParameterIntegers`。

`ParameterInteger`由[zigzag](https://developers.google.com/protocol-buffers/docs/encoding#types)方式编码得到，以使小负数和正数都被编码为小整数。将参数值编码为`ParameterInteger`按以下公式转换：

```javascript
ParameterInteger = (value << 1) ^ (value >> 31)
```

参数值不支持大于`pow(2,31) - 1`或`-1 * (pow(2,31) - 1)`的数值。

以下的公式用来将`ParameterInteger`解码为实际值：

```javascript
value = ((ParameterInteger >> 1) ^ (-(ParameterInteger & 1)))
```

#### 4.3.3. 指令类型

以下关于指令的描述中，游标的初始位置定义为坐标`(cX, cY)`，其中`cX`指代游标在X轴上的位置，`cY`指代游标在Y轴上的位置。

##### 4.3.3.1. MoveTo指令

表示`MoveTo`指令执行`n`的`ParameterInteger`**必须**立即接上`n`对`ParameterInteger`。对于`(dX, dY)`参数：

1. 定义坐标`(pX, pY)`，其中`pX = cX + dX`和`pY = cY + dY`。
   * 对于点要素，这个坐标定义了一个新的点要素。
   * 对于线要素，这个坐标定义了一条新的线要素的起点。
   * 对于面要素，这个坐标定义了一个新环的起点。
2. 将游标移至`(pX, pY)`。

##### 4.3.3.1. LineTo指令

表示`LineTo`指令执行`n`的`ParameterInteger`**必须**立即接上`n`对`ParameterInteger`。对于`(dX, dY)`参数：

1. 定义一条以游标位置`(cX, cY)`为起点，`(pX, pY)`为终点的线段，其中`pX = cX + dX`和`pY = cY + dY`。
   * 对于线要素，这条线段延长了当前线要素。
   * 对于面要素，这条线段延长了当前环。
2. 将游标移至`(pX, pY)`。

对于任意一对`(dX, dY)`，`dX`和`dY`**必须不**能同时为`0`.

#### 4.3.3.3. ClosePath指令

每条`ClosePath`指令**必须**只能执行一次并且无附带参数。这条指令通过构造一条以游标`(cX, cY)`为起点、当前环的起点为终点的线段，闭合面要素的当前环。

这条指定不改变游标的位置。

#### 4.3.4. 几何类型

要素`geometry`字段的`type`的取值**必须**是`GeomType`枚举值之一。支持的几何类型如下：

* UNKNOWN
* POINT
* LINESTRING
* POLYGON

不支持`GeometryCollection`类型。

##### 4.3.4.1. Unknown几何类型

本标准有意设置一个Unknown几何类型。这种几何类型**可以**用来编码试验性的几何类型。解码器**可以**选择忽略这种几何类型的要素。

##### 4.3.4.2. Point几何类型

`POINT`几何类型用来表示单点或多点几何。每个点几何的指令序列**必须**包含一个`MoveTo`指令，并且该指令的command count大于0。

如果`POINT`几何的`MoveTo`的command count为1，那么**必须**将其解析为单点；否则**必须**解析为多点，指令后面的每对`ParameterInteger`表示一个单点。

##### 4.3.4.3. Linestring几何类型

`LINESTRING`几何类型用来表示单线或多线几何。线几何的指令序列**必须**包含一个或多个下列序列：

1. 一个`MoveTo`指令，其command count为1
2. 一个`LineTo`指令，其command count大于0

如果`LINESTRING`的指令序列只包含1个`MoveTo`指令，那么**必须**将其解析为单线；否则，**必须**将其解析为多线，其中的每个`MoveTo`指令开始构造一条新线几何。

##### 4.3.4.4. Polygon几何类型

`POLYGON`几何类型表示面或多面几何，每个面有且只有一个外环和零个或多个内环。面几何的指令序列包含一个或多个下列序列：

1. 一个`ExteriorRing`
2. 零个或多个`InteriorRing`

Each `ExteriorRing` and `InteriorRing` MUST consist of the following sequence:
每个`ExteriorRing`和`InteriorRing`必须包含以下序列：

1. 一个`MoveTo`指令，其command count为1
2. 一个`LineTo`指令，其command count大于1
3. 一个`ClosePath`指令

一个外环被**定义**为一个线性的环，当应用[surveyor's formula](https://en.wikipedia.org/wiki/Shoelace_formula)，以多边形的节点在瓦片坐标系下的坐标计算面积时，其面积为正。在瓦片坐标系下（X向右为正，Y向下为正），外环节点以顺时针旋转。

一个内环被**定义**为一个线性的环，当应用[surveyor's formula](https://en.wikipedia.org/wiki/Shoelace_formula)，以多边形的节点在瓦片坐标系下的坐标计算面积时，其面积为负。在瓦片坐标系下（X向右为正，Y向下为正），内环节点以逆时针旋转。

如果`POLYGON`的指令序列只包含一个外环，那么**必须**将其解析为单面；否则，**必须**解析为多面几何，其中每个外环表示一个新面的开始。如果面几何包换内环，那么**必须**将其编码到所属的外环之后。

线性环**必须**不包含异常点，例如自相交或自相切。在`ClosePath`之前的坐标**不应该**与线性环的起始点坐标相同，因为会产生零长度的线段。线性环经过surveyor's formula计算的面积**不应该**为0，因为这意味着环包含有异常点。

面几何**必须不**能有内环相交，并且内环**必须**被包围在内环之中。

#### 4.3.5. 几何要素编码示例

##### 4.3.5.1. 点要素示例

假设示例点的坐标为：

* (25,7)

表示它只需要一条指令：

* MoveTo(+25, +17)

```bash
编码      : [ 9 50 34 ]
              | |  `> 解码: ((34 >> 1) ^ (-(34 & 1))) = +17
              | `> 解码: ((50 >> 1) ^ (-(50 & 1))) = +25
              | ===== 相对地 MoveTo(+25, +17) == 创建点 (25,17)
              `> [00001 001] = command id 1 (MoveTo), command count 1
```

##### 4.3.5.2. 多点要素示例

假设多点要素的坐标为:

* (5,7)
* (3,2)

编码需要两条指令：

* MoveTo(+5,+7)
* MoveTo(-2,-5)

```bash
编码      : [ 17 10 14 3 9 ]
               |  |  | | `> 解码: ((9 >> 1) ^ (-(9 & 1))) = -5
               |  |  | `> 解码: ((3 >> 1) ^ (-(3 & 1))) = -2
               |  |  | === 相对地 MoveTo(-2, -5) == 创建点 (3,2)
               |  |  `> 解码: ((34 >> 1) ^ (-(34 & 1))) = +7
               |  `> 解码: ((50 >> 1) ^ (-(50 & 1))) = +5
               | ===== relative MoveTo(+25, +17) == 创建点 (25,17)
               `> [00010 001] = command id 1 (MoveTo), command count 2
```

##### 4.3.5.3. 线要素示例

假设示例线要素的坐标为:

* (2,2)
* (2,10)
* (10,10)

编码需要3条指令：

* MoveTo(+2,+2)
* LineTo(+0,+8)
* LineTo(+8,+0)

```bash
编码      : [ 9 4 4 18 0 16 16 0 ]
              |      |      ==== 相对地 LineTo(+8, +0) == 连接到点 (10, 10)
              |      | ==== 相对地 LineTo(+0, +8) == 连接到点 (2, 10)
              |      `> [00010 010] = command id 2 (LineTo), command count 2
              | === 相对地 MoveTo(+2, +2)
              `> [00001 001] = command id 1 (MoveTo), command count 1
```

##### 4.3.5.4. Example Multi Linestring
##### 4.3.5.4. 多线要素示例

假设示例要素的坐标为：

* Line 1:
  * (2,2)
  * (2,10)
  * (10,10)
* Line 2:
  * (1,1)
  * (3,5)

编码需要以下指令：

* MoveTo(+2,+2)
* LineTo(+0,+8)
* LineTo(+8,+0)
* MoveTo(-9,-9)
* LineTo(+2,+4)

```bash
编码      : [ 9 4 4 18 0 16 16 0 9 17 17 10 4 8 ]
              |      |           |        | === 相对地 LineTo(+2, +4) == 连接到点 (3,5)
              |      |           |        `> [00001 010] = command id 2 (LineTo), command count 1
              |      |           | ===== 相对地 MoveTo(-9, -9) == 新建一条线从 (1,1)
              |      |           `> [00001 001] = command id 1 (MoveTo), command count 1
              |      |      ==== 相对地 LineTo(+8, +0) == 连接到点 (10, 10)
              |      | ==== 相对地 LineTo(+0, +8) == 连接到点 (2, 10)
              |      `> [00010 010] = command id 2 (LineTo), command count 2
              | === 相对地 MoveTo(+2, +2)
              `> [00001 001] = command id 1 (MoveTo), command count 1
```

##### 4.3.5.5. 面要素示例

假设示例面要素的坐标为：

* (3,6)
* (8,12)
* (20,34)
* (3,6) *闭合*

编码需要以下指令：

* MoveTo(3, 6)
* LineTo(5, 6)
* LineTo(12, 22)
* ClosePath

```bash
编码      : [ 9 6 12 18 10 12 24 44 15 ]
              |       |              `> [00001 111] command id 7 (ClosePath), command count 1
              |       |       ===== 相对地 LineTo(+12, +22) == 连接到点 (20, 34)
              |       | ===== 相对地 LineTo(+5, +6) == 连接到点 (8, 12)
              |       `> [00010 010] = command id 2 (LineTo), command count 2
              | ==== 相对地 MoveTo(+3, +6)
              `> [00001 001] = command id 1 (MoveTo), command count 1
```

##### 4.3.5.6. 多面要素示例

示例要素包含两个多边形，其中一个多边形有一个洞。多边形中的点如下。注意，多边形中的点环绕顺序**非常**重要，应为这个顺序被用来区别外环和内环。

* Polygon 1:
  * 外环:
    * (0,0)
    * (10,0)
    * (10,10)
    * (0,10)
    * (0,0) *闭合*
* Polygon 2:
  * 外环:
    * (11,11)
    * (20,11)
    * (20,20)
    * (11,20)
    * (11,11) *闭合*
  * 内环:
    * (13,13)
    * (13,17)
    * (17,17)
    * (17,13)
    * (13,13) *闭合*

编码需要以下一系列指令：

* MoveTo(+0,+0)
* LineTo(+10,+0)
* LineTo(+0,+10)
* LineTo(-10,+0) // 执行这条指令后，游标的位置在(0, 10)
* ClosePath // Polygon 1结束
* MoveTo(+11,+1) // **这条指令相对于上面最后一条LineTo指令！**
* LineTo(+9,+0)
* LineTo(+0,+9)
* LineTo(-9,+0) // 执行这条指令后，游标的位置在（11, 20)
* ClosePath // 这是一个新面要素，因为面积为正
* MoveTo(+2,-7) // **这条指令相对于上面最后一条LineTo指令！**
* LineTo(+0,+4)
* LineTo(+4,+0)
* LineTo(+0,-4) // 执行这条指令后，游标的位置在（17, 13)
* ClosePath // 这是一个内环，因为面积为负

### 4.4. 要素属性

要素属性被编码为`tag`字段中的一对对整数。在每对`tag`中，第一个整数表示key在其所属的`layer`的`keys`列表的中索引号（以0开始）。第二个整数表示value在其所属的`layer`的`values`列表的中索引号（以0开始）。一个要素的所有key索引**必须唯一**，以保证要素中没有重复的属性项。每个要素的`tag`字段**必须**为偶数。要素中的`tag`字段包含的key索引号或value索引号**必须不**能大于或等于相应图层中`keys`或`values`列表中的元素数目。

### 4.5. 示例

例如，一个GeoJSON格式的要素如下：

```json
{
    "type": "FeatureCollection",
    "features": [
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -8247861.1000836585,
                    4970241.327215323
                ]
            },
            "type": "Feature",
            "properties": {
                "hello": "world",
                "h": "world",
                "count": 1.23
            }
        },
        {
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -8247861.1000836585,
                    4970241.327215323
                ]
            },
            "type": "Feature",
            "properties": {
                "hello": "again",
                "count": 2
            }
        }
    ]
}
```

会被结构化为：

```js
layers {
  version: 2
  name: "points"
  features: {
    id: 1
    tags: 0
    tags: 0
    tags: 1
    tags: 0
    tags: 2
    tags: 1
    type: Point
    geometry: 9
    geometry: 2410
    geometry: 3080
  }
  features {
    id: 1
    tags: 0
    tags: 2
    tags: 2
    tags: 3
    type: Point
    geometry: 9
    geometry: 2410
    geometry: 3080
  }
  keys: "hello"
  keys: "h"
  keys: "count"
  values: {
    string_value: "world"
  }
  values: {
    double_value: 1.23
  }
  values: {
    string_value: "again"
  }
  values: {
    int_value: 2
  }
  extent: 4096
}
```

注意几何要素的实际坐标取决于坐标系和瓦片的范围。
