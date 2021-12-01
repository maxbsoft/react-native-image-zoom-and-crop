"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var react_native_1 = require("react-native");
var react_native_gesture_handler_1 = require("react-native-gesture-handler");
var react_native_reanimated_1 = __importStar(require("react-native-reanimated"));
var reanimatedTiming_1 = require("./helpers/reanimatedTiming");
var defaultProps = {
    imageBackdropColor: 'black',
};
var Value = react_native_reanimated_1.default.Value, event = react_native_reanimated_1.default.event, block = react_native_reanimated_1.default.block, set = react_native_reanimated_1.default.set, cond = react_native_reanimated_1.default.cond, eq = react_native_reanimated_1.default.eq, and = react_native_reanimated_1.default.and, greaterThan = react_native_reanimated_1.default.greaterThan, greaterOrEq = react_native_reanimated_1.default.greaterOrEq, lessThan = react_native_reanimated_1.default.lessThan, add = react_native_reanimated_1.default.add, sub = react_native_reanimated_1.default.sub, multiply = react_native_reanimated_1.default.multiply, divide = react_native_reanimated_1.default.divide, call = react_native_reanimated_1.default.call;
var styles = react_native_1.StyleSheet.create({
    panGestureInner: __assign(__assign({}, react_native_1.StyleSheet.absoluteFillObject), { alignItems: 'center', justifyContent: 'center' }),
    imageWrapper: {
        overflow: 'visible',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {},
});
var ImageViewer = /** @class */ (function (_super) {
    __extends(ImageViewer, _super);
    function ImageViewer(props) {
        var _this = _super.call(this, props) || this;
        _this.handleMove = function (args) {
            var onMove = _this.props.onMove;
            var positionX = args[0];
            var positionY = args[1];
            var scale = args[2];
            onMove({ positionX: positionX, positionY: positionY, scale: scale });
        };
        var areaWidth = props.areaWidth, areaHeight = props.areaHeight, imageWidth = props.imageWidth, imageHeight = props.imageHeight, minScale = props.minScale, _a = props.maxScale, maxScale = _a === void 0 ? minScale + 3 : _a, constraint = props.constraint;
        _this.pinchRef = react_1.default.createRef();
        _this.dragRef = react_1.default.createRef();
        _this.translateX = new Value(0);
        _this.translateY = new Value(0);
        _this.scale = new Value(minScale);
        var timingDefaultParams = {
            duration: 200,
            easing: react_native_reanimated_1.EasingNode.linear,
        };
        var offsetX = new Value(0);
        var offsetY = new Value(0);
        var offsetZ = new Value(minScale);
        var viewerAreaWidth = new Value(areaWidth);
        var viewerAreaHeight = new Value(areaHeight);
        var viewerImageWidth = new Value(imageWidth);
        var viewerImageHeight = new Value(imageHeight);
        var scaledWidth = multiply(viewerImageWidth, _this.scale);
        var scaledHeight = multiply(viewerImageHeight, _this.scale);
        var constraintValue = {
            offset: {
                x: new Value((constraint === null || constraint === void 0 ? void 0 : constraint.offset.x) || 0),
                y: new Value((constraint === null || constraint === void 0 ? void 0 : constraint.offset.y) || 0),
            },
            size: {
                width: (constraint === null || constraint === void 0 ? void 0 : constraint.size.width) ? new Value(constraint.size.width)
                    : viewerAreaWidth,
                height: (constraint === null || constraint === void 0 ? void 0 : constraint.size.height) ? new Value(constraint.size.height)
                    : viewerAreaHeight,
            },
        };
        // when scaling, the translation origin is shifted from
        // intitial origin: this value is the actual shift
        var scalingOriginShiftX = divide(sub(viewerAreaWidth, scaledWidth), 2);
        var scalingOriginShiftY = divide(sub(viewerAreaHeight, scaledHeight), 2);
        // blocked by constraint left edge
        var leftMarginX = constraintValue.offset.x;
        var translateXMax = divide(sub(leftMarginX, scalingOriginShiftX), _this.scale);
        // blocked by constraint rigth edge
        var rightMarginX = add(constraintValue.offset.x, constraintValue.size.width);
        var translateXMin = divide(sub(rightMarginX, scaledWidth, scalingOriginShiftX), _this.scale);
        // blocked by constraint top edge
        var topMarginY = constraintValue.offset.y;
        var translateYMax = divide(sub(topMarginY, scalingOriginShiftY), _this.scale);
        // blocked by constraint bottom edge
        var bottomMarginY = add(constraintValue.offset.y, constraintValue.size.height);
        var translateYMin = divide(sub(bottomMarginY, scaledHeight, scalingOriginShiftY), _this.scale);
        var enforceConstraint = block([
            cond(lessThan(_this.translateX, translateXMin), [
                set(_this.translateX, reanimatedTiming_1.timing(__assign({ from: _this.translateX, to: translateXMin }, timingDefaultParams))),
            ]),
            cond(greaterThan(_this.translateX, translateXMax), [
                set(_this.translateX, reanimatedTiming_1.timing(__assign({ from: _this.translateX, to: translateXMax }, timingDefaultParams))),
            ]),
            cond(lessThan(_this.translateY, translateYMin), [
                set(_this.translateY, reanimatedTiming_1.timing(__assign({ from: _this.translateY, to: translateYMin }, timingDefaultParams))),
            ]),
            cond(greaterThan(_this.translateY, translateYMax), [
                set(_this.translateY, reanimatedTiming_1.timing(__assign({ from: _this.translateY, to: translateYMax }, timingDefaultParams))),
            ]),
        ]);
        _this.onTapGestureEvent = event([
            {
                nativeEvent: function (_a) {
                    var state = _a.state;
                    return block([
                        cond(eq(state, react_native_gesture_handler_1.State.END), [
                            set(offsetZ, new Value(minScale)),
                            set(offsetX, new Value(0)),
                            set(offsetY, new Value(0)),
                            set(_this.scale, reanimatedTiming_1.timing(__assign({ from: _this.scale, to: minScale }, timingDefaultParams))),
                            set(_this.translateX, reanimatedTiming_1.timing(__assign({ from: _this.translateX, to: 0 }, timingDefaultParams))),
                            set(_this.translateY, reanimatedTiming_1.timing(__assign({ from: _this.translateY, to: 0 }, timingDefaultParams))),
                        ]),
                    ]);
                },
            },
        ]);
        _this.onPanGestureEvent = event([
            {
                nativeEvent: function (_a) {
                    var translationX = _a.translationX, translationY = _a.translationY, state = _a.state;
                    return block([
                        cond(eq(state, react_native_gesture_handler_1.State.ACTIVE), [
                            set(_this.translateX, add(divide(translationX, _this.scale), offsetX)),
                            set(_this.translateY, add(divide(translationY, _this.scale), offsetY)),
                        ]),
                        cond(eq(state, react_native_gesture_handler_1.State.END), enforceConstraint),
                        cond(eq(state, react_native_gesture_handler_1.State.END), [
                            set(offsetX, _this.translateX),
                            set(offsetY, _this.translateY),
                        ]),
                    ]);
                },
            },
        ]);
        _this.onPinchGestureEvent = event([
            {
                nativeEvent: function (_a) {
                    var scale = _a.scale, state = _a.state;
                    return block([
                        cond(and(eq(state, react_native_gesture_handler_1.State.ACTIVE), greaterOrEq(multiply(offsetZ, scale), minScale)), set(_this.scale, multiply(offsetZ, scale))),
                        cond(eq(state, react_native_gesture_handler_1.State.END), [set(offsetZ, _this.scale)]),
                        cond(and(eq(state, react_native_gesture_handler_1.State.END), greaterThan(_this.scale, new Value(maxScale))), [
                            set(offsetZ, new Value(maxScale)),
                            set(_this.scale, reanimatedTiming_1.timing(__assign({ from: _this.scale, to: maxScale }, timingDefaultParams))),
                        ]),
                    ]);
                },
            },
        ]);
        return _this;
    }
    ImageViewer.prototype.render = function () {
        var _this = this;
        var _a = this.props, image = _a.image, imageWidth = _a.imageWidth, imageHeight = _a.imageHeight, areaWidth = _a.areaWidth, areaHeight = _a.areaHeight, imageBackdropColor = _a.imageBackdropColor, overlay = _a.overlay;
        var imageSrc = {
            uri: image,
        };
        var areaStyles = {
            width: areaWidth,
            height: areaHeight,
            backgroundColor: imageBackdropColor,
        };
        var overlayContainerStyle = {
            position: 'absolute',
            top: 0,
            left: 0,
            height: areaHeight,
            width: areaWidth,
        };
        var imageWrapperStyles = [styles.imageWrapper, areaStyles];
        var imageStyles = [
            styles.image,
            {
                width: imageWidth,
                height: imageHeight,
                transform: [
                    {
                        scale: this.scale,
                    },
                    {
                        translateX: this.translateX,
                    },
                    {
                        translateY: this.translateY,
                    },
                ],
            },
        ];
        return (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(react_native_reanimated_1.default.Code, null, function () {
                return block([
                    call([_this.translateX, _this.translateY, _this.scale], _this.handleMove),
                ]);
            }),
            react_1.default.createElement(react_native_gesture_handler_1.PanGestureHandler, { ref: this.dragRef, simultaneousHandlers: this.pinchRef, minPointers: 1, maxPointers: 2, avgTouches: true, onGestureEvent: this.onPanGestureEvent, onHandlerStateChange: this.onPanGestureEvent },
                react_1.default.createElement(react_native_reanimated_1.default.View, { style: areaStyles },
                    react_1.default.createElement(react_native_gesture_handler_1.PinchGestureHandler, { ref: this.pinchRef, simultaneousHandlers: this.dragRef, onGestureEvent: this.onPinchGestureEvent, onHandlerStateChange: this.onPinchGestureEvent },
                        react_1.default.createElement(react_native_reanimated_1.default.View, { style: imageWrapperStyles, collapsable: false },
                            react_1.default.createElement(react_native_reanimated_1.default.Image, { style: imageStyles, source: imageSrc }),
                            overlay && (react_1.default.createElement(react_native_1.View, { style: overlayContainerStyle }, overlay))))))));
    };
    ImageViewer.defaultProps = defaultProps;
    return ImageViewer;
}(react_1.Component));
exports.default = ImageViewer;
