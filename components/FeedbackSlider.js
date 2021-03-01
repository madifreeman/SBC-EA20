import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const FeedbackSlider = ({ fieldId, rhfRef, rhfSetValue }) => {
  const SliderWithTooltip = Slider.createSliderWithTooltip(Slider);

  function handleOnChange(v) {
    rhfSetValue(fieldId, v)
  }

  return (
    <div>
      <SliderWithTooltip
        trackStyle={{ backgroundColor: "#38b2ac", height: 7 }}
        railStyle={{ backgroundColor: "#38b2ac", height: 7, opacity: 0.3 }}
        handleStyle={{
          borderColor: "#38b2ac",
          height: 22,
          width: 22,
          marginTop: -9,
          marginLeft: 6,
          backgroundColor: "white",
        }}
        onAfterChange={handleOnChange}
        min={0}
        max={10}
        tipProps={{visible: true}}
      />
      <input
        ref={rhfRef}
        name={fieldId}
        type="number"
        className="hidden"
        onChange={() => console.log(value)}
      />
    </div>
  );
}

export default FeedbackSlider;



 

