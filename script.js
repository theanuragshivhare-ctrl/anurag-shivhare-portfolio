const storage = {
  read(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value === null ? fallback : JSON.parse(value);
    } catch (error) {
      return fallback;
    }
  },
  write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      // Ignore storage issues in restricted contexts.
    }
  }
};

const showToast = (message) => {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('is-visible');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.classList.remove('is-visible');
  }, 2200);
};

const syllabus = [
  {
    unit: 1,
    title: 'Computer Fundamentals + UNIX',
    label: 'Topic organization for learning convenience',
    completion: 84,
    topics: ['Basic concepts of computers', 'Operating system basics', 'UNIX overview'],
    important: ['Computer architecture', 'UNIX shell', 'System commands']
  },
  {
    unit: 2,
    title: 'Introduction to C + Programming Fundamentals',
    label: 'Demo ISC content',
    completion: 78,
    topics: ['Introduction to C', 'Program structure', 'Variables and constants'],
    important: ['Syntax rules', 'Header files', 'Main function']
  },
  {
    unit: 3,
    title: 'Variables, Data Types, Expressions + I/O',
    label: 'Demo ISC content',
    completion: 72,
    topics: ['Data types', 'Operators', 'Input/output formatting'],
    important: ['Type compatibility', 'Format specifiers', 'Arithmetic expressions']
  },
  {
    unit: 4,
    title: 'Conditional Statements + Control Structures',
    label: 'Demo ISC content',
    completion: 70,
    topics: ['if-else', 'switch', 'Loops'],
    important: ['Decision making', 'Loop control', 'Nested conditions']
  },
  {
    unit: 5,
    title: 'Functions + Arrays',
    label: 'Demo ISC content',
    completion: 66,
    topics: ['User-defined functions', 'Function call', 'Arrays and indexing'],
    important: ['Parameter passing', 'One-dimensional arrays', 'Modular design']
  },
  {
    unit: 6,
    title: 'Structures + Pointers + Files',
    label: 'Demo ISC content',
    completion: 62,
    topics: ['Structures', 'Pointers', 'File handling'],
    important: ['Memory addressing', 'Struct members', 'File operations']
  }
];

const notes = [
  {
    unit: 1,
    topic: 'Computer fundamentals',
    type: 'conceptual',
    difficulty: 'Easy',
    readingTime: '5 min',
    title: 'Computer fundamentals overview',
    description: 'Core ideas about computer architecture, input-output devices, and operating systems.',
    concepts: ['CPU', 'Memory', 'I/O devices'],
    definition: 'A computer is an electronic device that accepts data, processes it, and produces useful output.',
    explanation: 'A computer system includes hardware and software working together. Input devices capture data, the CPU processes instructions, memory stores values temporarily, and output devices display or print the result.',
    example: 'Typing a program in the editor, compiling it, and then viewing output on the screen demonstrates the flow of data through a computer system.',
    importantPoints: ['Hardware and software work together', 'Memory stores data temporarily', 'Operating system manages resources'],
    commonMistakes: ['Confusing RAM with permanent storage', 'Forgetting the role of OS', 'Ignoring input-output cycle'],
    examQuestions: ['Define a computer and name its basic components.', 'What is the function of the CPU?'],
    vivaQuestions: ['What is the difference between hardware and software?', 'Why is the operating system important?'],
    content: 'Computers process data using hardware and software. They consist of input devices, processing units, memory, and output devices. The operating system controls system resources and helps the user interact with the machine.'
  },
  {
    unit: 1,
    topic: 'UNIX basics',
    type: 'practical',
    difficulty: 'Moderate',
    readingTime: '7 min',
    title: 'UNIX essentials',
    description: 'An introduction to command-line basics, files, directories, and shell usage.',
    concepts: ['Shell', 'Directory tree', 'Commands'],
    definition: 'UNIX is a multi-user, multi-tasking operating system commonly used for programming and system work.',
    explanation: 'UNIX follows a command-line model where users interact with the system through shell commands. Commands such as ls, pwd, cd, mkdir, and cp help manage files, directories, and system tasks efficiently.',
    example: 'A user types pwd to know the current directory, then ls to list files, and mkdir to create a folder for a project.',
    importantPoints: ['Commands are case-sensitive', 'Paths matter in UNIX', 'The shell interprets user instructions'],
    commonMistakes: ['Using Windows-style paths', 'Forgetting spaces in filenames', 'Not checking current directory'],
    examQuestions: ['What is a shell in UNIX?', 'List any four basic UNIX commands.'],
    vivaQuestions: ['Why is UNIX useful for programmers?', 'What is the purpose of pwd?'],
    content: 'UNIX is a powerful operating system built around a shell and command-line interface. It supports file management, process control, scripting, and system administration tasks, making it a standard for programming environments.'
  },
  {
    unit: 1,
    topic: 'Vi editor',
    type: 'practical',
    difficulty: 'Moderate',
    readingTime: '8 min',
    title: 'Using the vi editor',
    description: 'A practical overview of opening, editing, saving, and navigating files in vi.',
    concepts: ['Modes', 'Cursor movement', 'Saving files'],
    definition: 'vi is a screen-based text editor used in UNIX systems for creating and editing program files.',
    explanation: 'The vi editor has different modes such as command mode and insert mode. Users can move the cursor, insert text, delete lines, search patterns, and save changes using command syntax.',
    example: 'A student opens a C file using vi, inserts code, saves using :w, and exits with :q.',
    importantPoints: ['Use i to enter insert mode', 'Use :w to save', 'Use :q to quit'],
    commonMistakes: ['Editing without switching to insert mode', 'Forgetting to save changes', 'Confusing command mode with insert mode'],
    examQuestions: ['What is vi editor?', 'Explain the use of insert mode in vi.'],
    vivaQuestions: ['What is the purpose of :w and :q?', 'How is vi different from a GUI editor?'],
    content: 'vi is a lightweight but powerful editor in UNIX. It supports text manipulation and is widely used to write shell scripts and C programs in terminal-based environments.'
  },
  {
    unit: 2,
    topic: 'C program structure',
    type: 'conceptual',
    difficulty: 'Easy',
    readingTime: '6 min',
    title: 'Structure of a C program',
    description: 'How a basic C program is organized using header files, variables, and main function.',
    concepts: ['stdio.h', 'main()', 'return 0;'],
    definition: 'A C program is a sequence of instructions executed from the main function.',
    explanation: 'A typical C program begins with preprocessor directives and includes required header files. The main function contains the logic and returns an integer value to the operating system. Statements inside the function are executed in order.',
    example: 'A program prints a welcome message using printf() inside the main function.',
    importantPoints: ['Every C program has a main function', 'Include standard libraries when needed', 'Semicolons end statements'],
    commonMistakes: ['Missing braces', 'Using undeclared identifiers', 'Forgetting return type'],
    examQuestions: ['Write the basic structure of a C program.', 'Why is main() important?'],
    vivaQuestions: ['What is the purpose of stdio.h?', 'What does return 0 indicate?'],
    content: 'C programs follow a clear structure: include header files, declare variables, define functions, and execute statements in main(). This structure makes the code readable and manageable.'
  },
  {
    unit: 2,
    topic: 'Variables and constants',
    type: 'conceptual',
    difficulty: 'Easy',
    readingTime: '5 min',
    title: 'Variables and constants in C',
    description: 'Understanding how values are stored and used in C programs.',
    concepts: ['int', 'float', 'const'],
    definition: 'Variables are named memory locations used to store data, while constants hold fixed values that cannot be changed during execution.',
    explanation: 'Variables require a data type before they can be used. Constants are declared to prevent accidental modification. Choosing the correct type is crucial to memory usage and correct output.',
    example: 'int marks = 78; const float pi = 3.14;',
    importantPoints: ['Variables can change values', 'Constants remain fixed', 'Identifiers must follow naming rules'],
    commonMistakes: ['Using uninitialized variables', 'Mixing integer and floating-point values incorrectly', 'Using reserved keywords as names'],
    examQuestions: ['Differentiate between variable and constant.', 'How do you declare an integer variable in C?'],
    vivaQuestions: ['Why are constants useful?', 'What happens if a variable is used before initialization?'],
    content: 'A variable stores data that can change while a program runs. Constants represent fixed values such as mathematical or configuration values and are useful for maintaining program logic and clarity.'
  },
  {
    unit: 3,
    topic: 'Data types',
    type: 'summary',
    difficulty: 'Moderate',
    readingTime: '6 min',
    title: 'C data types',
    description: 'A guide to integer, float, char, and other common data representations in C.',
    concepts: ['int', 'float', 'char'],
    definition: 'A data type defines the kind of value a variable can store and the operations allowed on it.',
    explanation: 'C provides primitive data types such as int, float, double, and char. The correct data type helps in efficient memory use and ensures that operations produce valid outputs.',
    example: 'char grade = "A"; int age = 20; float salary = 45000.50;',
    importantPoints: ['Choose the smallest suitable type', 'Use float or double for decimals', 'char stores single characters'],
    commonMistakes: ['Assigning a floating value to int without conversion', 'Using char for numeric calculations', 'Ignoring type ranges'],
    examQuestions: ['List basic data types in C.', 'Why is data type selection important?'],
    vivaQuestions: ['What is the difference between int and float?', 'When do we use double?'],
    content: 'Data types define the memory representation and valid operations for variables. For programming tasks, selecting the correct data type improves accuracy, memory efficiency, and program reliability.'
  },
  {
    unit: 3,
    topic: 'Operators and expressions',
    type: 'conceptual',
    difficulty: 'Moderate',
    readingTime: '6 min',
    title: 'Arithmetic and logical operators',
    description: 'Understanding expressions, precedence, and operator usage in C.',
    concepts: ['Arithmetic operators', 'Relational operators', 'Logical operators'],
    definition: 'Operators are symbols that perform operations on operands, while expressions combine values and operators to produce results.',
    explanation: 'C supports arithmetic, relational, logical, assignment, and bitwise operators. Expression evaluation follows operator precedence rules, which determine the order of processing in a statement.',
    example: 'int total = a + b * c; if (a > b && c < d) { ... }',
    importantPoints: ['Operator precedence matters', 'Use parentheses to clarify logic', 'Logical operators combine conditions'],
    commonMistakes: ['Confusing = with ==', 'Ignoring precedence', 'Using an expression without parentheses in complex conditions'],
    examQuestions: ['What is the difference between = and ==?', 'Explain the operator precedence in arithmetic expression.'],
    vivaQuestions: ['Why are logical operators used?', 'What is the role of parentheses in expressions?'],
    content: 'Operators allow us to perform arithmetic, comparisons, and logical decisions. When expressions combine multiple operators, precedence rules tell the compiler which part to evaluate first.'
  },
  {
    unit: 4,
    topic: 'Conditional statements',
    type: 'practical',
    difficulty: 'Moderate',
    readingTime: '7 min',
    title: 'if, else, and switch',
    description: 'Decision-making structures used to control program flow based on conditions.',
    concepts: ['if', 'else if', 'switch'],
    definition: 'Conditional statements help the program take different actions based on whether a condition is true or false.',
    explanation: 'Conditions are expressions that evaluate to true or false. The if and else constructs allow branching, while switch handles multiple possible values efficiently in a simpler structure.',
    example: 'if (marks >= 40) printf("Pass\n"); else printf("Fail\n");',
    importantPoints: ['Check the condition carefully', 'Use else for default flow', 'switch is useful for fixed choices'],
    commonMistakes: ['Forgetting braces', 'Using assignment instead of comparison', 'Leaving a switch without break'],
    examQuestions: ['Write a simple if-else program.', 'When would you use switch over if-else?'],
    vivaQuestions: ['What is conditional execution?', 'How does a switch statement work?'],
    content: 'Conditional statements are essential in decision-making. They help the program respond differently depending on input, state, or user choices, enabling logic-driven tasks.'
  },
  {
    unit: 4,
    topic: 'Loops',
    type: 'practical',
    difficulty: 'Moderate',
    readingTime: '7 min',
    title: 'Loops in C',
    description: 'An overview of while, do-while, and for loops used for repeated execution.',
    concepts: ['for', 'while', 'do-while'],
    definition: 'Loops repeat a block of statements multiple times until a condition is satisfied or a count limit is reached.',
    explanation: 'Loops are used to reduce repetition in programs. The for loop is ideal for known counts, while loops run while a condition remains true, and do-while ensures the body executes at least once.',
    example: 'for (i = 1; i <= 5; i++) printf("%d\n", i);',
    importantPoints: ['Initialize loop variables correctly', 'Update the control variable', 'Avoid infinite loops'],
    commonMistakes: ['Forgetting increment or decrement', 'Using wrong loop condition', 'Infinite recursion of logic'],
    examQuestions: ['Differentiate between while and do-while.', 'Write a loop to print numbers 1 to 10.'],
    vivaQuestions: ['Why do loops reduce code complexity?', 'Which loop is better for a known number of iterations?'],
    content: 'Loops are among the most important control statements in C. They allow repeated execution of code blocks, making programs efficient and shorter.'
  },
  {
    unit: 5,
    topic: 'Functions',
    type: 'conceptual',
    difficulty: 'Moderate',
    readingTime: '8 min',
    title: 'Function design in C',
    description: 'How functions help organize code into reusable blocks and modular logic.',
    concepts: ['Function definition', 'Arguments', 'Return values'],
    definition: 'A function is a self-contained block of code designed to perform a specific task and can be reused multiple times.',
    explanation: 'Functions make programs modular. They reduce repetition, improve readability, and make testing easier. A function can accept parameters and return a value or simply execute logic.',
    example: 'int add(int a, int b) { return a + b; }',
    importantPoints: ['Functions improve reusability', 'Parameters pass values into the function', 'Return type must match result'],
    commonMistakes: ['Using wrong return type', 'Forgetting function prototype', 'Passing values incorrectly'],
    examQuestions: ['What is a function in C?', 'Write a function to calculate the sum of two integers.'],
    vivaQuestions: ['Why are functions useful in C?', 'What is the difference between call-by-value and call-by-reference?'],
    content: 'Functions help divide large programs into smaller, manageable units. They increase clarity, reduce duplication, and support code reuse across applications.'
  },
  {
    unit: 5,
    topic: 'Arrays',
    type: 'practical',
    difficulty: 'Moderate',
    readingTime: '7 min',
    title: 'Working with arrays',
    description: 'Using indexed storage to manage lists and sequential data in C.',
    concepts: ['Indexing', 'Array size', 'Traversal'],
    definition: 'An array is a collection of elements of the same type stored in contiguous memory locations.',
    explanation: 'Arrays allow repeated values to be managed efficiently with a single variable name. Each element is accessed through an index, making sorting, searching, and calculations easier.',
    example: 'int marks[5] = {70, 80, 90, 75, 85};',
    importantPoints: ['Indexing starts from zero', 'Array size must be fixed', 'Loop through elements for processing'],
    commonMistakes: ['Accessing out-of-bounds indexes', 'Forgetting initialization', 'Using wrong array size'],
    examQuestions: ['What is an array?', 'How do you access the third element of an array?'],
    vivaQuestions: ['Why are arrays useful?', 'What is the significance of array indexing?'],
    content: 'Arrays store related values together, reducing the need for multiple variables. They are widely used in numeric processing, data handling, and algorithm implementations.'
  },
  {
    unit: 6,
    topic: 'Structures',
    type: 'conceptual',
    difficulty: 'Moderate',
    readingTime: '7 min',
    title: 'Structures in C',
    description: 'Grouping related data fields under one structure for managed storage.',
    concepts: ['struct', 'members', 'nested structure'],
    definition: 'A structure is a user-defined data type that groups different data types under one name.',
    explanation: 'Structures are helpful when a program needs to store a record such as student information, including name, roll number, and marks. Multiple fields can be handled together as one unit.',
    example: 'struct Student { char name[20]; int roll; float marks; };',
    importantPoints: ['Members can have different data types', 'Use dot operator to access members', 'Structs keep data organized'],
    commonMistakes: ['Forgetting semicolon after struct definition', 'Using wrong member access', 'Not initializing fields'],
    examQuestions: ['Define a structure in C.', 'What are the advantages of using structures?'],
    vivaQuestions: ['How is a structure different from an array?', 'Why is a struct useful?'],
    content: 'Structures make it possible to store related but different kinds of information together. They are especially useful for records, student data, and complex input/output operations.'
  },
  {
    unit: 6,
    topic: 'Pointers',
    type: 'conceptual',
    difficulty: 'Hard',
    readingTime: '9 min',
    title: 'Introduction to pointers',
    description: 'Understanding memory addresses and pointer-based access in C.',
    concepts: ['Address', 'Dereference', 'Pointer arithmetic'],
    definition: 'A pointer is a variable that stores the memory address of another variable.',
    explanation: 'Pointers allow direct memory access and efficient handling of large data structures. They are powerful but must be used carefully to avoid invalid memory access and crashes.',
    example: 'int x = 10; int *p = &x; printf("%d", *p);',
    importantPoints: ['& gives address', '* accesses value at address', 'Pointers must be initialized'],
    commonMistakes: ['Using an uninitialized pointer', 'Confusing pointer value with address', 'Forgetting dereference operator'],
    examQuestions: ['What is a pointer?', 'Explain the use of & and * operators.'],
    vivaQuestions: ['Why are pointers important?', 'What happens if a pointer is not initialized?'],
    content: 'Pointers provide a way to work directly with memory addresses. They are a core concept in C and are essential for efficient memory management and dynamic programming.'
  },
  {
    unit: 6,
    topic: 'File handling',
    type: 'practical',
    difficulty: 'Moderate',
    readingTime: '8 min',
    title: 'File input and output in C',
    description: 'Reading and writing data to files using C file functions.',
    concepts: ['FILE *', 'fopen()', 'fclose()'],
    definition: 'File handling allows programs to store data permanently in external files and retrieve it later.',
    explanation: 'C uses file pointers and functions such as fopen(), fclose(), fprintf(), and fscanf() to read and write files. This is important for saving records and processing large data sets.',
    example: 'FILE *fp = fopen("data.txt", "w"); fprintf(fp, "Hello\n"); fclose(fp);',
    importantPoints: ['Open file in correct mode', 'Close files to release resources', 'Check file pointer before using it'],
    commonMistakes: ['Forgetting to close file', 'Opening in wrong mode', 'Reading from an unopened file'],
    examQuestions: ['What is file handling in C?', 'Explain fopen() mode values.'],
    vivaQuestions: ['Why are files used in C?', 'What is the role of fclose()?'],
    content: 'File handling makes data persistence possible. Programs can read from and write to files, which is required for storing information such as student records, logs, and application data.'
  }
];

const practicals = [
  {
    number: 1,
    title: 'Basic UNIX Commands',
    objective: 'Practice essential UNIX command-line operations for file and directory management.',
    theory: 'UNIX commands such as pwd, ls, cd, mkdir, rm, cp, and mv are used to navigate directories and manage files.',
    procedure: ['Open the terminal.', 'List current files using ls.', 'Create and navigate directories.', 'Copy and remove files safely.'],
    code: 'pwd\nls\nmkdir demo\ncd demo\ncp ../notes.txt .',
    expected: 'The user can locate the working directory, create folders, copy files, and verify changes using command output.',
    viva: ['What is the purpose of pwd?', 'How does cp differ from mv?']
  },
  {
    number: 2,
    title: 'Vi Editor',
    objective: 'Create and edit a text file using vi commands and modes.',
    theory: 'vi supports command mode and insert mode, making it effective for quick file editing in a terminal environment.',
    procedure: ['Open a file with vi name.c.', 'Switch to insert mode using i.', 'Edit the content.', 'Save with :w and exit with :q.'],
    code: 'vi hello.c\ni\n#include <stdio.h>\nint main(){\n printf("Hello");\n return 0;\n}\nESC\n:wq',
    expected: 'A complete source file is saved successfully and can be reopened for review.',
    viva: ['What is the difference between command mode and insert mode?', 'Why is vi widely used in UNIX?']
  },
  {
    number: 3,
    title: 'DOS Commands',
    objective: 'Understand internal and external DOS commands used in the Windows environment and shell basics.',
    theory: 'DOS commands such as dir, cd, copy, del, and cls help manage files and directories in command prompt systems.',
    procedure: ['Open command prompt.', 'List directory contents.', 'Create a folder and files.', 'Delete or rename files as required.'],
    code: 'dir\ncd Desktop\nmkdir lab\ncopy sample.txt lab\\sample.txt',
    expected: 'The commands create the expected file and directory changes in the system environment.',
    viva: ['What is the difference between internal and external DOS commands?', 'Why is dir useful?']
  },
  {
    number: 4,
    title: 'Batch Programming',
    objective: 'Use batch scripts to automate straightforward tasks in Windows.',
    theory: 'Batch files contain lines of DOS commands that execute in sequence and simplify repetitive work.',
    procedure: ['Create a .bat file.', 'Write a set of command lines.', 'Execute the script.', 'Inspect output.'],
    code: '@echo off\nmkdir backup\ncopy *.txt backup\necho Backup complete',
    expected: 'The batch file performs sequential actions and produces the expected output without manual work.',
    viva: ['What is a batch file?', 'Why are batch scripts useful in labs?']
  },
  {
    number: 5,
    title: 'Simple Shell Scripts',
    objective: 'Write a shell script to automate command execution in a UNIX environment.',
    theory: 'Shell scripts are text files containing commands executed by the shell, making tasks repeatable and efficient.',
    procedure: ['Write a script with shebang.', 'Add commands.', 'Set execute permission.', 'Run the script.'],
    code: '#!/bin/bash\necho "Current directory: $(pwd)"\nls -l',
    expected: 'The shell script prints the directory and lists files when executed.',
    viva: ['What is a shell script?', 'How do we make a script executable?']
  },
  {
    number: 6,
    title: 'Basic C Programs',
    objective: 'Write simple C programs to calculate output values and verify language syntax.',
    theory: 'C programs are built using variables, operators, and function calls to solve basic computational tasks.',
    procedure: ['Write the program in C.', 'Compile using gcc.', 'Run the executable.', 'Check the output.'],
    code: '#include <stdio.h>\nint main() {\n    int a = 5, b = 7;\n    printf("Sum = %d", a + b);\n    return 0;\n}',
    expected: 'The program prints the sum of the two integers correctly after compilation.',
    viva: ['What is the role of gcc?', 'What does printf do in C?']
  },
  {
    number: 7,
    title: 'Data Types and Expressions',
    objective: 'Use variables and expressions correctly to perform arithmetic operations.',
    theory: 'C differentiates between integer, floating-point, and character data types, affecting memory and logic.',
    procedure: ['Declare variables of appropriate types.', 'Apply arithmetic operators.', 'Print calculated values.'],
    code: '#include <stdio.h>\nint main() {\n    int a = 10;\n    float b = 3.5;\n    printf("%f", a * b);\n    return 0;\n}',
    expected: 'The expression produces a floating-point output matching the correct arithmetic result.',
    viva: ['What is the difference between int and float?', 'Why is expression evaluation order important?']
  },
  {
    number: 8,
    title: 'Conditional Statements',
    objective: 'Use if-else and switch constructs to control branching in C programs.',
    theory: 'Conditional statements allow different actions based on whether a condition evaluates to true or false.',
    procedure: ['Read the input value.', 'Check the condition.', 'Display the matching result.'],
    code: '#include <stdio.h>\nint main() {\n    int n = 7;\n    if (n % 2 == 0) printf("Even");\n    else printf("Odd");\n    return 0;\n}',
    expected: 'The output prints whether the number is even or odd depending on the condition.',
    viva: ['What is the purpose of if-else?', 'When is switch more effective than if-else?']
  },
  {
    number: 9,
    title: 'Loops and Control Structures',
    objective: 'Use iterative logic to repeat tasks and reduce code redundancy.',
    theory: 'Loops allow repeated execution until a condition is satisfied or a fixed number of iterations completes.',
    procedure: ['Initialize loop variable.', 'Set condition.', 'Update variable each cycle.', 'Print output.'],
    code: '#include <stdio.h>\nint main() {\n    for (int i = 1; i <= 5; i++) {\n        printf("%d\\n", i);\n    }\n    return 0;\n}',
    expected: 'The program prints numbers from 1 to 5 in sequence.',
    viva: ['Differentiate between while and do-while.', 'Why do we use loops?']
  },
  {
    number: 10,
    title: 'Arrays',
    objective: 'Store and process a list of related values using arrays.',
    theory: 'Arrays store elements of the same type in contiguous memory locations.',
    procedure: ['Declare the array.', 'Initialize values.', 'Traverse and print them.'],
    code: '#include <stdio.h>\nint main() {\n    int marks[5] = {78, 82, 90, 87, 91};\n    for (int i = 0; i < 5; i++) printf("%d\\n", marks[i]);\n    return 0;\n}',
    expected: 'All array elements are displayed in order with their indices.',
    viva: ['What is array indexing?', 'What is the limitation of arrays?']
  },
  {
    number: 11,
    title: 'Functions',
    objective: 'Build reusable C functions to simplify program logic and code maintenance.',
    theory: 'Functions help break large programs into smaller, manageable blocks for readability and reuse.',
    procedure: ['Define a function.', 'Pass arguments.', 'Call it inside main().'],
    code: '#include <stdio.h>\nint add(int a, int b) { return a + b; }\nint main() {\n    printf("%d", add(4, 5));\n    return 0;\n}',
    expected: 'The function returns and prints the correct sum of the two values.',
    viva: ['What is the advantage of using functions?', 'How is a return value used in a function?']
  },
  {
    number: 12,
    title: 'Structures',
    objective: 'Group related information such as student records in one logical unit.',
    theory: 'Structures allow combined storage of different data types in a single user-defined record.',
    procedure: ['Define a struct.', 'Create variables of that type.', 'Assign and print values.'],
    code: '#include <stdio.h>\nstruct Student { char name[20]; int roll; };\nint main() {\n    struct Student s = {"Amit", 21};\n    printf("%s %d", s.name, s.roll);\n    return 0;\n}',
    expected: 'The program prints the structured data accurately using dot operator access.',
    viva: ['How is a structure different from an array?', 'Why are structures useful for records?']
  },
  {
    number: 13,
    title: 'Pointers',
    objective: 'Learn how memory addresses are handled and passed between variables.',
    theory: 'Pointers store addresses of variables, enabling efficient memory manipulation and dynamic access.',
    procedure: ['Declare an integer variable.', 'Assign pointer address using &.', 'Print value using * pointer.'],
    code: '#include <stdio.h>\nint main() {\n    int x = 10;\n    int *p = &x;\n    printf("%d", *p);\n    return 0;\n}',
    expected: 'The pointer prints the correct value stored at the original variable address.',
    viva: ['What is a pointer?', 'What is the meaning of *p and &x?']
  },
  {
    number: 14,
    title: 'File Handling',
    objective: 'Store program data in files and read it back as needed.',
    theory: 'File handling in C allows programs to operate with external data using FILE pointers and functions like fprintf and fscanf.',
    procedure: ['Open a file in write mode.', 'Write text values.', 'Close the file and reopen to read it.'],
    code: '#include <stdio.h>\nint main() {\n    FILE *fp = fopen("demo.txt", "w");\n    fprintf(fp, "C and UNIX");\n    fclose(fp);\n    return 0;\n}',
    expected: 'The file is created and contains the specified text content.',
    viva: ['What is fopen()?', 'Why should files be closed after use?']
  }
];

const quizQuestions = [
  {
    unit: 1,
    question: 'Which of the following best describes the purpose of an operating system?',
    options: ['To write programs only', 'To manage hardware and provide an interface for users', 'To store only text files', 'To replace the compiler'],
    answer: 1,
    explanation: 'An operating system manages computer resources, schedules processes, and provides a user interface for interacting with the system.'
  },
  {
    unit: 1,
    question: 'Which UNIX command displays the current working directory?',
    options: ['ls', 'pwd', 'cd', 'mkdir'],
    answer: 1,
    explanation: 'pwd prints the present working directory, helping the user know the current path.'
  },
  {
    unit: 2,
    question: 'What is the purpose of the main() function in a C program?',
    options: ['It defines a variable', 'It marks the start of program execution', 'It stores the file system', 'It formats output only'],
    answer: 1,
    explanation: 'Execution of a C program begins from the main() function, where the program logic is written.'
  },
  {
    unit: 3,
    question: 'Which data type is most suitable for storing a number with decimal value?',
    options: ['char', 'int', 'float', 'void'],
    answer: 2,
    explanation: 'float is used to store decimal numbers in C, while int stores integers.'
  },
  {
    unit: 4,
    question: 'Which loop executes the body at least once even if the condition is false?',
    options: ['for', 'while', 'do-while', 'switch'],
    answer: 2,
    explanation: 'The do-while loop evaluates the condition after executing the loop body, so it always runs once.'
  },
  {
    unit: 5,
    question: 'What is an array in C?',
    options: ['A single variable storing multiple values of the same type', 'A function that returns strings', 'A method for writing files', 'A pointer to memory'],
    answer: 0,
    explanation: 'An array is a collection of elements of the same data type stored in contiguous memory locations.'
  },
  {
    unit: 6,
    question: 'Which operator is used to access the value stored at a pointer address?',
    options: ['&', '*', '%', '#'],
    answer: 1,
    explanation: 'The * operator dereferences a pointer and gives access to the value stored at its memory address.'
  },
  {
    unit: 6,
    question: 'Which function is used to open a file in C?',
    options: ['printf()', 'scanf()', 'fopen()', 'getch()'],
    answer: 2,
    explanation: 'fopen() opens a file and returns a pointer that can be used for reading or writing.'
  }
];

const assignments = [
  { title: 'C Programming Basics', description: 'Write a C program to print your student details and compute simple arithmetic results.', assigned: '2026-10-01', deadline: '2026-10-06', status: 'pending', progress: 35, marks: 20 },
  { title: 'Conditional Statements', description: 'Create a C program using if-else, switch, and nested conditions to evaluate grade logic.', assigned: '2026-09-27', deadline: '2026-10-04', status: 'submitted', progress: 100, marks: 20 },
  { title: 'Loop Programs', description: 'Practice factorial, multiplication table, and pattern problems using for and while loops.', assigned: '2026-10-02', deadline: '2026-10-08', status: 'due-soon', progress: 62, marks: 15 },
  { title: 'Functions and Arrays', description: 'Write modular functions to sort, sum, and display array elements in a structured way.', assigned: '2026-09-21', deadline: '2026-09-30', status: 'reviewed', progress: 90, marks: 25 },
  { title: 'UNIX Commands', description: 'Demonstrate basic UNIX commands for navigation, file creation, and command-line automation.', assigned: '2026-10-05', deadline: '2026-10-12', status: 'pending', progress: 40, marks: 15 }
];

const papers = [
  { type: 'Mid Semester', year: 2025, title: 'Demo Mid Semester Paper', format: 'PDF' },
  { type: 'End Semester', year: 2024, title: 'Demo End Semester Paper', format: 'PDF' },
  { type: 'Quiz', year: 2025, title: 'Demo C Basics Quiz Paper', format: 'DOC' },
  { type: 'Practical', year: 2024, title: 'Demo Practical Lab Assessment', format: 'PDF' },
  { type: 'Practice Paper', year: 2025, title: 'Demo Practice Paper', format: 'PDF' },
  { type: 'Practical', year: 2023, title: 'UNIX and Vi Lab Demo', format: 'ZIP' }
];

const announcements = [
  { date: '2026-10-02', title: 'UNIX command drill scheduled', text: 'Students should revise pwd, ls, mkdir, cp and file navigation commands before the next lab session.', important: true, priority: 'IMPORTANT' },
  { date: '2026-09-29', title: 'C basics notes updated', text: 'The notes on data types, variables, and control statements have been refreshed for revision support.', important: false, priority: 'NEW' },
  { date: '2026-09-24', title: 'Quiz practice window open', text: 'A short quiz practice set on UNIX, loops, and functions is available for self-assessment.', important: true, priority: 'REMINDER' }
];

const resources = [
  { type: 'PDF', title: 'UNIX Command Cheat Sheet', description: 'Quick reference for essential operating system commands, navigation, and file handling.', resource: 'PDF guide' },
  { type: 'Reference', title: 'C Programming Syntax Pack', description: 'A compact guide to variables, loops, functions, arrays, and pointers in C.', resource: 'Reference sheet' },
  { type: 'Link', title: 'Linux Shell Basics', description: 'A beginner-friendly tutorial for working with the shell and command-line environment.', resource: 'Reading link' },
  { type: 'Video', title: 'Vi Editor Practice', description: 'A short walk-through for editing and saving files in vi with common commands.', resource: '10 min video' },
  { type: 'Study Guide', title: 'C & UNIX Revision Notes', description: 'Focused revision material covering major topics, lab tasks, and likely theory questions.', resource: 'Study pack' },
  { type: 'Reference', title: 'File Handling in C', description: 'A quick guide to fopen, fprintf, fscanf, and file management in C programs.', resource: 'Template' }
];
const appState = {
  quizIndex: 0,
  submitted: false,
  quizTimer: 900,
  timerHandle: null,
  selectedAnswers: Array(quizQuestions.length).fill(null)
};

const renderSyllabus = () => {
  const container = document.getElementById('syllabusGrid');
  if (!container) return;
  container.innerHTML = syllabus.map((unit) => `
    <article class="module-card">
      <div class="module-card-header">
        <div>
          <p class="mini-label">Unit ${unit.unit}</p>
          <h3>${unit.title}</h3>
        </div>
        <span class="unit-tag">${unit.unit}</span>
      </div>
      <div class="demo-badge">${unit.label}</div>
      <div class="progress-line"><span style="width:${unit.completion}%"></span></div>
      <div class="module-meta">
        <span>${unit.completion}% complete</span>
        <span>Key focus</span>
      </div>
      <ul class="topic-list">${unit.topics.map((topic) => `<li>${topic}</li>`).join('')}</ul>
      <p><strong>Focus:</strong> ${unit.important.join(', ')}</p>
      <div class="module-actions">
        <button class="secondary-btn small" type="button" data-demo="note">Notes</button>
        <button class="primary-btn small" type="button" data-demo="practice">Practice</button>
      </div>
    </article>
  `).join('');
};

const populateNoteFilters = () => {
  const unitFilter = document.getElementById('unitFilter');
  const topicFilter = document.getElementById('topicFilter');
  if (!unitFilter || !topicFilter) return;

  const uniqueUnits = [...new Set(notes.map((note) => note.unit))];
  const uniqueTopics = [...new Set(notes.map((note) => note.topic))];

  unitFilter.innerHTML = '<option value="all">All Units</option>' + uniqueUnits.map((item) => `<option value="${item}">Unit ${item}</option>`).join('');
  topicFilter.innerHTML = '<option value="all">All Topics</option>' + uniqueTopics.map((item) => `<option value="${item}">${item}</option>`).join('');
};

const renderNotes = () => {
  const grid = document.getElementById('notesGrid');
  const empty = document.getElementById('notesEmpty');
  if (!grid || !empty) return;

  const unitFilter = document.getElementById('unitFilter');
  const topicFilter = document.getElementById('topicFilter');
  const typeFilter = document.getElementById('typeFilter');
  const searchValue = document.getElementById('searchInput')?.value.trim().toLowerCase() || '';

  const filtered = notes.filter((note) => {
    const matchesUnit = unitFilter?.value === 'all' || String(note.unit) === unitFilter?.value;
    const matchesTopic = topicFilter?.value === 'all' || note.topic === topicFilter?.value;
    const matchesType = typeFilter?.value === 'all' || note.type === typeFilter?.value;
    const matchesSearch = !searchValue || [note.title, note.description, note.topic, note.concepts.join(' '), note.content, note.importantPoints.join(' ')].join(' ').toLowerCase().includes(searchValue);
    return matchesUnit && matchesTopic && matchesType && matchesSearch;
  });

  if (!filtered.length) {
    grid.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }

  empty.classList.add('hidden');
  grid.innerHTML = filtered.map((note) => `
    <article class="note-card" data-note-title="${note.title}" data-note-topic="${note.topic}">
      <div class="note-card-top">
        <p class="mini-label">Unit ${note.unit}</p>
        <button class="bookmark-btn" type="button" data-bookmark-note="${note.title}" aria-label="Bookmark ${note.title}">☆</button>
      </div>
      <h3>${note.title}</h3>
      <div class="note-meta">
        <span class="meta-pill">${note.topic}</span>
        <span class="meta-pill">${note.type}</span>
        <span class="meta-pill">${note.difficulty}</span>
        <span class="meta-pill">${note.readingTime}</span>
      </div>
      <p>${note.description}</p>
      <div class="note-meta">${note.importantPoints.map((item) => `<span class="meta-pill">${item}</span>`).join('')}</div>
      <div class="note-exam-box">
        <strong>Exam focus</strong>
        <p>${note.examQuestions[0]}</p>
      </div>
      <div class="actions">
        <button type="button" data-open-note="${note.title}">Read Notes</button>
        <button type="button" data-download-note="${note.title}">Download PDF</button>
      </div>
    </article>
  `).join('');
};

const renderSearchResults = () => {
  const input = document.getElementById('searchInput');
  const results = document.getElementById('searchResults');
  if (!input || !results) return;

  const query = input.value.trim().toLowerCase();
  if (!query) {
    results.classList.add('hidden');
    results.innerHTML = '';
    return;
  }

  const matches = [
    ...notes.filter((note) => [note.title, note.topic, note.description, note.content].join(' ').toLowerCase().includes(query)).map((note) => ({ label: note.title, category: `Note • Unit ${note.unit}`, type: 'note', target: note.title })),
    ...papers.filter((paper) => [paper.title, paper.type].join(' ').toLowerCase().includes(query)).map((paper) => ({ label: paper.title, category: `Paper • ${paper.type}`, type: 'paper', target: paper.title })),
    ...assignments.filter((assignment) => [assignment.title, assignment.description].join(' ').toLowerCase().includes(query)).map((assignment) => ({ label: assignment.title, category: 'Assignment', type: 'assignment', target: assignment.title })),
    ...practicals.filter((practical) => [practical.title, practical.objective].join(' ').toLowerCase().includes(query)).map((practical) => ({ label: practical.title, category: 'Activity', type: 'activity', target: practical.title }))
  ].slice(0, 6);

  if (!matches.length) {
    results.innerHTML = '<div class="search-empty">No results found for this ISC search.</div>';
    results.classList.remove('hidden');
    return;
  }

  results.innerHTML = matches.map((item) => `
    <button class="search-result" type="button" data-search-target="${item.target}" data-search-type="${item.type}">
      <span>${item.label}</span>
      <small>${item.category}</small>
    </button>
  `).join('');
  results.classList.remove('hidden');
};

const renderPracticals = () => {
  const container = document.getElementById('practicalList');
  if (!container) return;
  container.innerHTML = practicals.map((practical) => `
    <article class="practical-card">
      <div class="practical-header">
        <p class="mini-label">Activity ${practical.number}</p>
        <h3>${practical.title}</h3>
      </div>
      <div class="two-column">
        <div>
          <h4>Objective</h4>
          <p>${practical.objective}</p>
          <h4>Theory</h4>
          <p>${practical.theory}</p>
          <h4>Instructions</h4>
          <ul>${practical.procedure.map((step) => `<li>${step}</li>`).join('')}</ul>
        </div>
        <div>
          <h4>Example</h4>
          <div class="code-box">
            <button class="copy-btn" type="button" data-copy-code="${practical.number}">Copy</button>
            <pre>${practical.code}</pre>
          </div>
          <h4>Practice task</h4>
          <p>${practical.expected}</p>
          <h4>Viva questions</h4>
          <ul>${practical.viva.map((question) => `<li>${question}</li>`).join('')}</ul>
        </div>
      </div>
    </article>
  `).join('');
};

const renderAssignments = () => {
  const container = document.getElementById('assignmentList');
  if (!container) return;
  container.innerHTML = assignments.map((assignment) => `
    <article class="assignment-item">
      <div class="assignment-header">
        <h3>${assignment.title}</h3>
        <span class="assignment-status ${assignment.status.replace(/\s+/g, '-')}">${assignment.status}</span>
      </div>
      <p>${assignment.description}</p>
      <div class="assignment-meta">
        <span>Assigned: ${assignment.assigned}</span>
        <span>Deadline: ${assignment.deadline}</span>
        <span>Marks: ${assignment.marks}</span>
      </div>
      <div class="assignment-foot">
        <span class="progress-pill"><span class="dot"></span> ${assignment.progress}% complete</span>
        <button class="primary-btn small" type="button" data-submit-assignment="${assignment.title}">Submit</button>
      </div>
    </article>
  `).join('');
};

const renderPapers = () => {
  const container = document.getElementById('paperGrid');
  const typeFilter = document.getElementById('paperTypeFilter');
  const yearFilter = document.getElementById('paperYearFilter');
  if (!container || !typeFilter || !yearFilter) return;

  const availableYears = [...new Set(papers.map((paper) => paper.year))].sort((a, b) => b - a);
  yearFilter.innerHTML = '<option value="all">All years</option>' + availableYears.map((year) => `<option value="${year}">${year}</option>`).join('');

  const filtered = papers.filter((paper) => {
    const matchesType = typeFilter.value === 'all' || paper.type === typeFilter.value;
    const matchesYear = yearFilter.value === 'all' || String(paper.year) === yearFilter.value;
    return matchesType && matchesYear;
  });

  container.innerHTML = filtered.map((paper) => `
    <article class="paper-card">
      <p class="mini-label">${paper.type}</p>
      <h3>${paper.title}</h3>
      <div class="paper-meta">
        <span>Year: ${paper.year}</span>
        <span>${paper.format}</span>
      </div>
      <p>Practice paper with revision-focused questions and model prompts.</p>
      <div class="paper-actions">
        <button type="button" data-open-paper="${paper.title}">View</button>
        <button type="button" data-download-paper="${paper.title}">Download</button>
      </div>
    </article>
  `).join('');
};

const renderAnnouncements = () => {
  const container = document.getElementById('announcementList');
  if (!container) return;
  container.innerHTML = announcements.map((announcement) => `
    <article class="announcement-item">
      <div class="announcement-head">
        <h3>${announcement.title}</h3>
        <span class="badge-new">${announcement.priority}</span>
      </div>
      <p>${announcement.text}</p>
      <div class="announcement-date">${announcement.date}</div>
    </article>
  `).join('');
};

const renderResources = () => {
  const container = document.getElementById('resourceGrid');
  if (!container) return;
  container.innerHTML = resources.map((resource) => `
    <article class="resource-card">
      <span class="resource-type">${resource.type}</span>
      <h3>${resource.title}</h3>
      <p>${resource.description}</p>
      <button type="button" data-open-resource="${resource.title}">${resource.resource}</button>
    </article>
  `).join('');
};

const openModal = (type, title, body) => {
  const modal = document.getElementById('contentModal');
  if (!modal) return;
  const modalType = document.getElementById('modalType');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  if (!modalType || !modalTitle || !modalBody) return;

  modalType.textContent = type;
  modalTitle.textContent = title;
  modalBody.innerHTML = body;
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
};

const closeModal = () => {
  const modal = document.getElementById('contentModal');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
};

const getNoteByTitle = (title) => notes.find((note) => note.title === title);

const handleNoteAction = (title) => {
  const note = getNoteByTitle(title);
  if (!note) return;
  const body = `
    <p><strong>Topic:</strong> ${note.topic}</p>
    <p><strong>Type:</strong> ${note.type}</p>
    <p><strong>Difficulty:</strong> ${note.difficulty}</p>
    <p><strong>Reading time:</strong> ${note.readingTime}</p>
    <p><strong>Definition:</strong> ${note.definition}</p>
    <p><strong>Explanation:</strong> ${note.explanation}</p>
    <p><strong>Example:</strong> ${note.example}</p>
    <p><strong>Key points:</strong> ${note.importantPoints.join(', ')}</p>
    <p><strong>Common mistakes:</strong> ${note.commonMistakes.join(', ')}</p>
    <h4>Exam questions</h4>
    <ul>${note.examQuestions.map((item) => `<li>${item}</li>`).join('')}</ul>
    <h4>Viva questions</h4>
    <ul>${note.vivaQuestions.map((item) => `<li>${item}</li>`).join('')}</ul>
  `;
  openModal('Quick Revision Note', note.title, body);
};

const downloadTextFile = (filename, text) => {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.txt`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

const handleDownloadNote = (title) => {
  const note = getNoteByTitle(title);
  if (!note) return;
  downloadTextFile(`${note.title.toLowerCase().replace(/\s+/g, '-')}`, `${note.title}\n\n${note.content}`);
  showToast('Demo PDF downloaded.');
};

const handleAssignmentSubmit = (title) => {
  const assignment = assignments.find((item) => item.title === title);
  if (!assignment) return;
  assignment.status = 'submitted';
  assignment.progress = 100;
  renderAssignments();
  showToast(`${title} submitted successfully.`);
};

const renderQuiz = () => {
  const current = quizQuestions[appState.quizIndex];
  const questionNumber = document.getElementById('quizQuestionNumber');
  const unitLabel = document.getElementById('quizUnitLabel');
  const quizQuestion = document.getElementById('quizQuestionBox');
  const optionsContainer = document.getElementById('quizOptions');
  const progress = document.getElementById('quizProgress');
  const score = document.getElementById('quizScore');
  const submitButton = document.getElementById('submitQuiz');
  const nextButton = document.getElementById('nextQuestion');

  if (!current || !questionNumber || !unitLabel || !quizQuestion || !optionsContainer || !progress || !score || !submitButton || !nextButton) return;

  const answered = appState.selectedAnswers[appState.quizIndex];
  questionNumber.textContent = `Question ${appState.quizIndex + 1} of ${quizQuestions.length}`;
  unitLabel.textContent = `Unit ${current.unit}`;
  quizQuestion.innerHTML = `<p>${current.question}</p>`;

  progress.style.width = `${((appState.quizIndex + 1) / quizQuestions.length) * 100}%`;
  const currentScore = appState.selectedAnswers.reduce((sum, answer, index) => sum + (answer === quizQuestions[index].answer ? 1 : 0), 0);
  score.textContent = `${currentScore}/${quizQuestions.length}`;

  optionsContainer.innerHTML = current.options.map((option, index) => {
    const isSelected = answered === index;
    const isCorrect = appState.submitted && index === current.answer;
    const isWrong = appState.submitted && isSelected && index !== current.answer;
    return `
      <button type="button" class="option-item ${isCorrect ? 'is-correct' : ''} ${isWrong ? 'is-wrong' : ''}" data-answer-index="${index}" ${appState.submitted ? 'disabled' : ''}>
        <span class="option-marker">${String.fromCharCode(65 + index)}</span>
        <span>${option}</span>
      </button>
    `;
  }).join('');

  if (appState.submitted) {
    const explanation = document.createElement('div');
    explanation.className = 'ai-response';
    explanation.innerHTML = `<strong>Explanation:</strong> ${current.explanation}`;
    optionsContainer.appendChild(explanation);
  }

  nextButton.textContent = appState.quizIndex === quizQuestions.length - 1 ? 'Finish' : 'Next';
  submitButton.classList.toggle('hidden', !appState.submitted && appState.quizIndex !== quizQuestions.length - 1);
};

const startTimer = () => {
  if (appState.timerHandle) window.clearInterval(appState.timerHandle);
  appState.timerHandle = window.setInterval(() => {
    const timerEl = document.getElementById('quizTimer');
    if (!timerEl) return;
    appState.quizTimer -= 1;
    const minutes = Math.floor(appState.quizTimer / 60);
    const seconds = appState.quizTimer % 60;
    timerEl.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    if (appState.quizTimer <= 0) {
      submitQuiz();
      window.clearInterval(appState.timerHandle);
    }
  }, 1000);
};

const submitQuiz = () => {
  appState.submitted = true;
  renderQuiz();

  const totalRight = quizQuestions.reduce((sum, question, index) => sum + (appState.selectedAnswers[index] === question.answer ? 1 : 0), 0);
  const history = storage.read('isc-quiz-history', []);
  history.push({ score: `${totalRight}/${quizQuestions.length}`, date: new Date().toLocaleDateString() });
  storage.write('isc-quiz-history', history.slice(-5));
  renderQuizHistory();
  showToast(`Quiz submitted. Score: ${totalRight}/${quizQuestions.length}`);
};

const renderQuizHistory = () => {
  const list = document.getElementById('scoreHistory');
  if (!list) return;
  const history = storage.read('isc-quiz-history', []);
  list.innerHTML = history.length ? history.map((entry) => `<li><span>${entry.date}</span><strong>${entry.score}</strong></li>`).join('') : '<li><span>None yet</span><strong>—</strong></li>';
};

const handleQuizOptionClick = (index) => {
  if (appState.submitted) return;
  appState.selectedAnswers[appState.quizIndex] = index;
  renderQuiz();
};

const handleNavigation = (targetId) => {
  const target = document.getElementById(targetId);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

const initTheme = () => {
  const savedTheme = storage.read('isc-theme', 'dark');
  const root = document.documentElement;
  const button = document.getElementById('themeToggle');
  const apply = (theme) => {
    root.classList.toggle('light', theme === 'light');
    if (button) {
      button.textContent = theme === 'dark' ? '☾' : '☀';
      button.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    }
  };
  apply(savedTheme);
  if (button) {
    button.addEventListener('click', () => {
      const theme = root.classList.contains('light') ? 'dark' : 'light';
      storage.write('isc-theme', theme);
      apply(theme);
    });
  }
};

const bindGlobalEvents = () => {
  document.querySelectorAll('[data-scroll]').forEach((button) => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-scroll');
      if (targetId) handleNavigation(targetId);
    });
  });

  document.querySelectorAll('.nav-item').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.nav-item').forEach((item) => item.classList.toggle('is-active', item === button));
      const targetId = button.getAttribute('data-target');
      if (targetId) handleNavigation(targetId);
    });
  });

  document.getElementById('searchInput')?.addEventListener('input', () => {
    renderNotes();
    renderSearchResults();
  });
  document.getElementById('unitFilter')?.addEventListener('change', renderNotes);
  document.getElementById('topicFilter')?.addEventListener('change', renderNotes);
  document.getElementById('typeFilter')?.addEventListener('change', renderNotes);
  document.getElementById('paperTypeFilter')?.addEventListener('change', renderPapers);
  document.getElementById('paperYearFilter')?.addEventListener('change', renderPapers);

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const bookmarkNote = target.getAttribute('data-bookmark-note');
    if (bookmarkNote) {
      const bookmarks = storage.read('isc-bookmarks', []);
      const updated = bookmarks.includes(bookmarkNote) ? bookmarks : [...bookmarks, bookmarkNote];
      storage.write('isc-bookmarks', updated);
      showToast(`${bookmarkNote} saved to your revision list.`);
    }

    const noteTitle = target.getAttribute('data-open-note');
    if (noteTitle) handleNoteAction(noteTitle);

    const noteDownload = target.getAttribute('data-download-note');
    if (noteDownload) handleDownloadNote(noteDownload);

    const assignmentTitle = target.getAttribute('data-submit-assignment');
    if (assignmentTitle) handleAssignmentSubmit(assignmentTitle);

    const copyCode = target.getAttribute('data-copy-code');
    if (copyCode) {
      const practical = practicals.find((item) => item.number === Number(copyCode));
      if (practical) {
        navigator.clipboard?.writeText(practical.code).catch(() => undefined);
        showToast('Code copied to clipboard.');
      }
    }

    const paperTitle = target.getAttribute('data-open-paper');
    if (paperTitle) {
      const paper = papers.find((item) => item.title === paperTitle);
      if (paper) {
        openModal('Previous Paper', paper.title, `<p><strong>Type:</strong> ${paper.type}</p><p><strong>Year:</strong> ${paper.year}</p><p>Sample paper preview to replace with the official ISC exam paper later.</p>`);
      }
    }

    const paperDownload = target.getAttribute('data-download-paper');
    if (paperDownload) {
      showToast(`${paperDownload} download started.`);
      downloadTextFile(paperDownload.toLowerCase().replace(/\s+/g, '-'), `Sample draft for ${paperDownload}.`);
    }

    const resourceTitle = target.getAttribute('data-open-resource');
    if (resourceTitle) {
      const resource = resources.find((item) => item.title === resourceTitle);
      if (resource) {
        openModal('Resource', resource.title, `<p><strong>Type:</strong> ${resource.type}</p><p>${resource.description}</p><p>Demo content for academic material: this can be replaced with actual ISC PDFs, links, or video metadata later.</p>`);
      }
    }

    const searchTarget = target.closest('[data-search-target]');
    if (searchTarget) {
      const targetName = searchTarget.getAttribute('data-search-target');
      const type = searchTarget.getAttribute('data-search-type');
      const searchInput = document.getElementById('searchInput');
      if (searchInput) searchInput.value = targetName;
      const results = document.getElementById('searchResults');
      if (results) {
        results.classList.add('hidden');
        results.innerHTML = '';
      }

      if (type === 'note') {
        handleNoteAction(targetName);
      } else if (type === 'paper') {
        const paper = papers.find((item) => item.title === targetName);
        if (paper) openModal('Previous Paper', paper.title, `<p><strong>Type:</strong> ${paper.type}</p><p><strong>Year:</strong> ${paper.year}</p><p>Demo ISC paper preview for revision and exam preparation.</p>`);
      } else if (type === 'assignment') {
        const assignment = assignments.find((item) => item.title === targetName);
        if (assignment) openModal('Assignment', assignment.title, `<p><strong>Description:</strong> ${assignment.description}</p><p><strong>Deadline:</strong> ${assignment.deadline}</p><p><strong>Marks:</strong> ${assignment.marks}</p>`);
      } else if (type === 'activity') {
        const practical = practicals.find((item) => item.title === targetName);
        if (practical) openModal('Activity', practical.title, `<p><strong>Objective:</strong> ${practical.objective}</p><p><strong>Instructions:</strong> ${practical.procedure.join(' • ')}</p><p><strong>Practice task:</strong> ${practical.expected}</p>`);
      }
    }

    const aiPrompt = target.getAttribute('data-ai-prompt');
    if (aiPrompt) {
      const aiInput = document.getElementById('aiQuery');
      if (aiInput) {
        aiInput.value = aiPrompt;
        aiInput.focus();
      }
    }

    const demoAction = target.getAttribute('data-demo');
    if (demoAction) {
      if (demoAction === 'answer') {
        openModal('Daily Question', 'What makes a good introduction in a presentation?', '<p>A good introduction creates context, states the purpose clearly, and engages the audience with a brief hook or relevant opening statement.</p>');
      } else if (demoAction === 'announce') {
        showToast('Professor announcement drafted in demo mode.');
      } else if (demoAction === 'notes') {
        showToast('Notes upload mock interaction triggered.');
      } else if (demoAction === 'assignment') {
        showToast('Assignment form opened in professor mode.');
      } else if (demoAction === 'quiz') {
        showToast('Quiz builder opened in demo mode.');
      } else if (demoAction === 'paper') {
        showToast('Previous paper upload form opened.');
      } else if (demoAction === 'note' || demoAction === 'practice') {
        showToast('Unit practice flow opened in demo mode.');
      }
    }

    const searchResults = document.getElementById('searchResults');
    if (searchResults && !target.closest('.search-wrap') && !target.closest('.search-result')) {
      searchResults.classList.add('hidden');
      searchResults.innerHTML = '';
    }

    if (target.matches('[data-close="modal"]')) {
      closeModal();
    }

    if (target.closest('.option-item')) {
      const optionButton = target.closest('.option-item');
      const selected = Number(optionButton.getAttribute('data-answer-index'));
      handleQuizOptionClick(selected);
    }
  });

  document.getElementById('nextQuestion')?.addEventListener('click', () => {
    if (appState.quizIndex < quizQuestions.length - 1) {
      appState.quizIndex += 1;
      renderQuiz();
    } else {
      submitQuiz();
    }
  });

  document.getElementById('prevQuestion')?.addEventListener('click', () => {
    if (appState.quizIndex > 0) {
      appState.quizIndex -= 1;
      renderQuiz();
    }
  });

  document.getElementById('submitQuiz')?.addEventListener('click', submitQuiz);

  document.getElementById('askAI')?.addEventListener('click', () => {
    const input = document.getElementById('aiQuery');
    const responseBox = document.getElementById('aiResponse');
    if (!input || !responseBox) return;

    const prompt = input.value.trim();
    if (!prompt) {
      showToast('Type a prompt to ask ISC AI.');
      return;
    }

    const templates = {
      'explain this topic': 'Here is a simple explanation: a C program begins with a main function and follows a clear sequence of declarations, logic, and output statements. The goal is to process data accurately, control program flow, and produce valid results.',
      'give me 5 mcqs': '1. What is the role of the main() function in C?\n2. Which operator is used to access the value stored by a pointer?\n3. Why are loops used in C programs?\n4. What is the output of a file-handling program that writes to a text file?\n5. Which UNIX command displays the current directory?',
      'summarize this unit': 'This unit focuses on the fundamentals of C programming, UNIX usage, data storage, control flow, and practical problem solving. The core goal is to write correct, structured programs that solve computing problems efficiently.',
      'prepare me for viva': 'Start with a direct answer, explain the concept in simple words, and add one example from programming logic. Keep your response concise, structured, and technically clear.'
    };

    const matched = Object.keys(templates).find((key) => prompt.toLowerCase().includes(key));
    responseBox.innerHTML = `<p><strong>AI assistant:</strong> ${matched ? templates[matched] : `I can help you with: “${prompt}”. This is a mock response for the prototype; connect the backend later to provide real AI-generated answers.`}</p>`;
    input.value = '';
  });

  document.getElementById('contentModal')?.addEventListener('click', (event) => {
    const target = event.target;
    if (target instanceof Element && target.getAttribute('data-close') === 'modal') {
      closeModal();
    }
  });
};

const initialize = () => {
  renderSyllabus();
  populateNoteFilters();
  renderNotes();
  renderPracticals();
  renderAssignments();
  renderPapers();
  renderAnnouncements();
  renderResources();
  renderQuiz();
  renderQuizHistory();
  initTheme();
  bindGlobalEvents();
  startTimer();
};

initialize();
