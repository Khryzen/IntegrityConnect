import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// --- TYPESCRIPT INTERFACE ---
interface Slide {
  id: string;
  title: string;
  description: string;
  color?: string; 
}

const { width } = Dimensions.get("window");
const slides: Slide[] = [
  {
    id: "1",
    title: "Welcome!",
    description: "Start your journey with us.",
    color: "#4F63AC",
  },
  {
    id: "2",
    title: "Step Two",
    description: "Easily track your goals.",
    color: "#FF6F61", 
  },
  {
    id: "3",
    title: "Final Step",
    description: "You're all set to go!",
    color: "#6B5B95",
  },
];
interface PaginationProps {
  data: Slide[];
  currentIndex: number;
}

const Pagination: React.FC<PaginationProps> = ({ data, currentIndex }) => {
  return (
    <View className="flex flex-row justify-center py-2">
      {data.map((_, index) => (
        <View
          key={index}
          className={`h-2 w-2 rounded-full mx-2 ${
            index === currentIndex ? "bg-gray-800" : "bg-gray-300"
          }`}
        />
      ))}
    </View>
  );
};
interface ControlsProps {
  currentIndex: number;
  totalSlides: number;
  onNext: () => void;
  onPrev: () => void;
  onDone: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  currentIndex,
  totalSlides,
  onNext,
  onPrev,
  onDone,
}) => {
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalSlides - 1;

  return (
    <View className="flex-row justify-between px-5 py-4 border-t border-gray-200">
      <TouchableOpacity
        onPress={onPrev}
        className={`p-2 ${isFirst ? "opacity-0" : "opacity-100"}`}
        disabled={isFirst}
      >
        <Text className="text-base font-bold text-gray-800">Prev</Text>
      </TouchableOpacity>

      <View className="flex-1" />

      <TouchableOpacity onPress={isLast ? onDone : onNext} className="p-2">
        <Text className="text-base font-bold text-gray-800">
          {isLast ? "Done" : "Next"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

interface MultiStepCarouselProps {
  onDone: () => void;
}

export default function MultiStepCarousel({ onDone }: MultiStepCarouselProps) {
  const flatListRef = useRef<FlatList<Slide> | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollToNext = () => {
    if (currentIndex < slides.length - 1) {
      // Use the correct ref type
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    }
  };

  const scrollToPrev = () => {
    if (currentIndex > 0) {
      // Use the correct ref type
      flatListRef.current?.scrollToIndex({
        index: currentIndex - 1,
        animated: true,
      });
    }
  };

  const handleOnScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(newIndex);
  };

  const renderSlideItem: ListRenderItem<Slide> = ({ item }) => (
    <View
      style={{ width: width, backgroundColor: item.color }}
      className={`flex-1 justify-center items-center p-5`}
    >
      <Text className="text-3xl font-bold text-white mb-2">{item.title}</Text>
      <Text className="text-lg text-white text-center">{item.description}</Text>
    </View>
  );

  return (
    <View className="flex-1 bg-transparent">
      <FlatList<Slide>
        ref={flatListRef}
        data={slides}
        renderItem={renderSlideItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onScroll={handleOnScroll}
        scrollEventThrottle={16}
        className="flex-1 rounded-lg bg-transparent"
      />

      <Pagination data={slides} currentIndex={currentIndex} />
      <Controls
        currentIndex={currentIndex}
        totalSlides={slides.length}
        onNext={scrollToNext}
        onPrev={scrollToPrev}
        onDone={onDone}
      />
    </View>
  );
}
