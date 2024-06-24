// src/mockData.js
export const data = {
  projects: [
    {
      id: "1",
      name: "Project A",
      questions: [
        {
          id: "1-1",
          name: "Question A1",
          experiments: [
            {
              id: "1-1-1",
              name: "Experiment A1-1",
              samples: [
                {
                  id: "1-1-1-1",
                  name: "Sample A1-1-1",
                  readouts: [
                    { id: "1-1-1-1-1", name: "Readout A1-1-1-1" },
                    { id: "1-1-1-1-2", name: "Readout A1-1-1-2" },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    // More projects...
  ],
};
