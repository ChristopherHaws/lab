import dotenv from 'dotenv';
import { OpenAI } from '@langchain/openai';
import { StringOutputParser } from 'langchain/schema/output_parser';
import { BufferMemory } from 'langchain/memory';
import {
	AIMessagePromptTemplate,
	ChatPromptTemplate,
	MessagesPlaceholder,
	SystemMessagePromptTemplate,
} from '@langchain/core/prompts';

dotenv.config();

// const memory = new BufferMemory({
// 	returnMessages: true, // Return stored messages as instances of `BaseMessage`
// 	memoryKey: 'chat_history', // This must match up with our prompt template input variable.
// });

function dump<T>(t: T): T {
	console.dir(t);
	return t;
}

const model = new OpenAI(
	dump({
		openAIApiKey: process.env.OPENAI_API_KEY,
		user: process.env.OPENAI_ORG_KEY,
		temperature: 0,
	}),
);

// model.pipe(new StringOutputParser());

// const questionGeneratorTemplate = ChatPromptTemplate.fromMessages([
// 	AIMessagePromptTemplate.fromTemplate(
// 		'Given the following conversation about a codebase and a follow up question, rephrase the follow up question to be a standalone question.',
// 	),
// 	new MessagesPlaceholder('chat_history'),
// 	AIMessagePromptTemplate.fromTemplate(`Follow Up Input: {question}\nStandalone question:`),
// ]);

// const question = "How can I initialize a ReAct agent?";
// const result = await questionGeneratorTemplate.invoke({
//   question,
// });

const message = SystemMessagePromptTemplate.fromTemplate('{text}');
const chatPrompt = ChatPromptTemplate.fromMessages([
	['ai', 'You are a helpful assistant.'],
	message,
]);
const formattedChatPrompt = await chatPrompt.invoke({
	text: 'Hello world!',
});

// model.pipe(memory);
const response = await model.invoke(formattedChatPrompt);
console.log(response);
