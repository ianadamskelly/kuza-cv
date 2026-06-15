import { View, Text, StyleSheet } from "@react-pdf/renderer";

const s = StyleSheet.create({
  layer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 60,
    color: "rgba(0,0,0,0.08)",
    fontWeight: 700,
    transform: "rotate(-30deg)",
    letterSpacing: 4,
  },
});

export function Watermark() {
  return (
    <View style={s.layer} fixed>
      <Text style={s.text}>PREVIEW — cv.kuzakizazi.com</Text>
    </View>
  );
}
