import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Timer, Check, Pause, Play } from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';

interface CookingModeScreenProps {
  onBack: () => void;
}

export function CookingModeScreen({ onBack }: CookingModeScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(420); // 7 minutes in seconds
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const steps = [
    {
      step: 1,
      instruction: 'Season chicken breast with salt, pepper, and a drizzle of olive oil.',
      duration: 120,
    },
    {
      step: 2,
      instruction: 'Heat a grill pan over medium-high heat. Cook chicken for 6-7 minutes per side.',
      duration: 900,
    },
    {
      step: 3,
      instruction: 'While chicken cooks, wash and chop vegetables into bite-sized pieces.',
      duration: 300,
    },
    {
      step: 4,
      instruction: 'Combine greens, tomatoes, and cucumber in a large bowl.',
      duration: 120,
    },
    {
      step: 5,
      instruction: 'Slice cooked chicken and place on top of salad. Drizzle with lemon juice and olive oil.',
      duration: 180,
    },
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCompletedSteps([...completedSteps, currentStep]);
      setCurrentStep(currentStep + 1);
      setTimeRemaining(steps[currentStep + 1].duration);
      setTimerActive(false);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setTimeRemaining(steps[currentStep - 1].duration);
      setTimerActive(false);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="h-full flex flex-col pt-12 bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={onBack} className="p-1 -ml-1">
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div className="flex-1">
            <h2 className="text-gray-900">Cooking Mode</h2>
            <p className="text-gray-500 text-sm">
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        {/* Timer Circle */}
        <div className="relative w-64 h-64 mb-8">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="112"
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="16"
            />
            <circle
              cx="128"
              cy="128"
              r="112"
              fill="none"
              stroke="#f97316"
              strokeWidth="16"
              strokeDasharray={`${
                (timeRemaining / steps[currentStep].duration) * 703.7
              } 703.7`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Timer className="w-8 h-8 text-orange-500 mb-2" />
            <p className="text-gray-900">{formatTime(timeRemaining)}</p>
            <p className="text-gray-500 text-sm">remaining</p>
          </div>
        </div>

        {/* Timer Controls */}
        <Button
          onClick={() => setTimerActive(!timerActive)}
          className={`w-20 h-20 rounded-full mb-8 ${
            timerActive
              ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              : 'bg-orange-500 hover:bg-orange-600 text-white'
          }`}
        >
          {timerActive ? (
            <Pause className="w-8 h-8" />
          ) : (
            <Play className="w-8 h-8" />
          )}
        </Button>

        {/* Current Step */}
        <div className="bg-orange-50 rounded-2xl p-6 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center flex-shrink-0">
              {currentStep + 1}
            </div>
            <p className="text-gray-800 flex-1">
              {steps[currentStep].instruction}
            </p>
          </div>
        </div>

        {/* Step Navigation */}
        <div className="flex items-center gap-4">
          <Button
            onClick={handlePrevStep}
            disabled={currentStep === 0}
            variant="outline"
            className="px-6"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Previous
          </Button>
          <Button
            onClick={handleNextStep}
            disabled={currentStep === steps.length - 1}
            className="bg-orange-500 hover:bg-orange-600 px-6"
          >
            {currentStep === steps.length - 1 ? (
              <>
                <Check className="w-5 h-5 mr-1" />
                Finish
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-5 h-5 ml-1" />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Step Progress Dots */}
      <div className="px-6 py-4 border-t border-gray-100">
        <div className="flex justify-center gap-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index < currentStep
                  ? 'bg-green-500'
                  : index === currentStep
                  ? 'bg-orange-500'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
