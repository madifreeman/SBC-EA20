import { useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

export default function FeedbackSlider(props) {
  const [value, setValue] = useState(0);
  const SliderWithTooltip = Slider.createSliderWithTooltip(Slider);

  function handleOnChange(v) {
    setValue(v)  
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
        defaultValue={value} // component re-renders onAfterChange(because state is being set)
                            // on re-render, slider gets set back to default value - so default value
                            // needs to be set as state 
        min={0}
        max={10}
        tipProps={{visible: true}}
      />
      <input
        ref={props.rhfRef}
        name={props.fieldId}
        value={value}
        className="hidden"
        onChange={() => console.log(value)}
      />
    </div>
  );
}



 

