import { Market } from "@/types/market";
// import { ChartConfig, ChartContainer } from "./ui/chart";
import { Cell, Legend, Pie, PieChart } from "recharts";
import { ChartConfig, ChartContainer } from "./ui/chart";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

interface OptionsProps {
  market: Market;
}
const Options: React.FC<OptionsProps> = ({ market }) => {
  const chartConfig: ChartConfig = market.predictionOptions.reduce(
    (acc, option, index) => {
      acc[option.optionId] = {
        label: option.predictionOption,
        color: COLORS[index % COLORS.length],
      };
      return acc;
    },
    {} as ChartConfig,
  );
  const volume = market.predictionOptions.reduce(
    (acc, { optionsCount }) => (acc += optionsCount),
    0,
  );

  const pieChartData = market.predictionOptions.map((option) => {
    return {
      name: option.predictionOption,
      value: option.optionsCount / volume,
      order: option.optionId,
    };
  });

  console.log("Pie chart data point:", pieChartData);
  return (
    <ChartContainer
      config={chartConfig}
      className="h-[200px] flex items-center justify-center w-full"
    >
      <PieChart width={400} height={250}>
        <Pie
          dataKey="value"
          cx="50%"
          cy="50%"
          innerRadius={40}
          outerRadius={80}
          data={pieChartData}
        >
          {pieChartData.map((_entry, index) => {
            console.log("Rendering cell:", _entry);
            return (
              <Cell
                key={`${_entry.order}`}
                fill={COLORS[index % COLORS.length]}
              />
            );
          })}
        </Pie>
        <Legend margin={{ bottom: -500 }} verticalAlign="top" align="center" />
      </PieChart>
    </ChartContainer>
  );
};

export default Options;
