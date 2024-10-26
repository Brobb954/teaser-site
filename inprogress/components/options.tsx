import { Market } from "@/types/market";
import { ChartConfig, ChartContainer } from "./ui/chart";
import { Cell, Legend, Pie, PieChart } from "recharts";

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
    };
  });

  return (
    <div>
      <ChartContainer config={chartConfig}>
        <PieChart>
          <Pie
            dataKey="value"
            innerRadius={40}
            cy={75}
            outerRadius={80}
            data={pieChartData}
          >
            {pieChartData.map((_entry, index) => (
              <Cell key={`${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend />
        </PieChart>
      </ChartContainer>
    </div>
  );
};

export default Options;
