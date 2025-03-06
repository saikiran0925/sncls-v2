export const jsonifyHelpData = {
  title: "JSONify",
  subtitle: "Learn how to use JSONify to format, escape, and manipulate JSON data.",
  sections: [
    {
      title: "Features",
      type: "features",
      items: [
        {
          icon: "MdFormatAlignLeft",
          title: "Prettify",
          description: "Formats your JSON or text content to make it more readable.",
          input: `{"name":"John", "age":30}`,
          output: `{
  "name": "John",
  "age": 30
}`,
        },
        {
          icon: "MdFormatAlignJustify",
          title: "Stringify",
          description: "Converts a JSON object into a compact string format.",
          input: `{
  "name": "Alice",
  "city": "London"
}`,
          output: `{"name":"Alice","city":"London"}`,
        },
      ],
    },
    {
      title: "FAQ",
      type: "faq",
      items: [
        {
          question: "How do I format JSON?",
          answer: "Use the **Prettify** button to apply proper indentation.",
        },
      ],
    },
  ],
};

export const blankSpaceHelpData = {
  title: "Blank Space",
  subtitle: "Learn how to use Blank Space for creative formatting.",
  sections: [
    {
      title: "Features",
      type: "features",
      items: [
        {
          icon: "MdSpaceBar",
          title: "Add Spaces",
          description: "Allows you to add custom blank spaces between text elements.",
          input: `"Hello___World"`,
          output: `"Hello   World"`,
        },
      ],
    },
  ],
};

export const diffEditorHelpData = {
  title: "Diff Editor",
  subtitle: "Compare and edit differences between two text files.",
  sections: [
    {
      title: "Features",
      type: "features",
      items: [
        {
          icon: "MdCompare",
          title: "Compare Files",
          description: "Highlights differences between two text files.",
          input: `"oldText": "Hello" vs "newText": "Hello World"`,
          output: `"Changes detected: 'World' added."`,
        },
      ],
    },
  ],
};

// Export all help data as an object
export const helpPages = {
  "jsonify": jsonifyHelpData,
  "blank-space": blankSpaceHelpData,
  "diff-editor": diffEditorHelpData,
};

