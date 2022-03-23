import Token from '../Token';

import LiteralNode from './LiteralNode';
import BinaryOpNode from './BinaryOpNode';
import UnaryOpNode from './UnaryOpNode';
import VarAccessNode from './VarAccessNode';
import VarAssignNode from './VarAssignNode';
import IfNode from './control flow/IfNode';
import ForNode from './control flow/ForNode';
import WhileNode from './control flow/WhileNode';
import FuncDefNode from './FuncDefNode';
import FuncCallNode from './FuncCallNode';
import ListNode from './ListNode';
import BreakNode from './control flow/BreakNode';
import ContinueNode from './control flow/ContinueNode';
import ReturnNode from './control flow/ReturnNode';
import StatementsNode from './StatementsNode';

export default abstract class AST {
	protected constructor(
		protected token?: Token,
	) {}
}

export type NodeTypes =
	| LiteralNode
	| BinaryOpNode
	| UnaryOpNode
	| VarAccessNode
	| VarAssignNode
	| IfNode
	| ForNode
	| WhileNode
	| FuncDefNode
	| FuncCallNode
	| ListNode
	| StatementsNode
	| BreakNode
	| ContinueNode
	| ReturnNode;

// Exclude nodes that return void
export type NodeReturn = NodeTypes;
// Exclude<NodeTypes, IfNode | ForNode | WhileNode>;