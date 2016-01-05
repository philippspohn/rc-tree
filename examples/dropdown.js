// use jsx to render html, do not modify simple.html
import 'rc-tree/assets/index.less';
import 'rc-tree/assets/demo-dropdown.less';
import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import Tree, {TreeNode} from 'rc-tree';
import Trigger from 'rc-trigger';
import { gData } from './util';

const placements = {
  topLeft: {
    points: ['bl', 'tl'],
    overflow: {
      adjustX: 1,
      adjustY: 1,
    },
    offset: [0, -3],
    targetOffset: [0, 0],
  },
  bottomLeft: {
    points: ['tl', 'bl'],
    overflow: {
      adjustX: 1,
      adjustY: 1,
    },
    offset: [0, 3],
    targetOffset: [0, 0],
  },
};
const DropdownTree = React.createClass({
  propTypes: {
    minOverlayWidthMatchTrigger: PropTypes.bool,
    onVisibleChange: PropTypes.func,
    prefixCls: PropTypes.string,
    children: PropTypes.any,
    transitionName: PropTypes.string,
    overlayClassName: PropTypes.string,
    animation: PropTypes.any,
    align: PropTypes.object,
    overlayStyle: PropTypes.object,
    placement: PropTypes.string,
    trigger: PropTypes.array,
  },
  getDefaultProps() {
    return {
      minOverlayWidthMatchTrigger: true,
      prefixCls: 'demo-dropdown-tree',
      trigger: ['hover'],
      overlayClassName: '',
      overlayStyle: {},
      defaultVisible: false,
      onVisibleChange() {
      },
      placement: 'bottomLeft',
    };
  },
  getInitialState() {
    const props = this.props;
    if ('visible' in props) {
      return {
        visible: props.visible,
      };
    }
    return {
      visible: props.defaultVisible,
    };
  },
  componentWillReceiveProps(props) {
    if ('visible' in props) {
      this.setState({
        visible: props.visible,
      });
    }
  },
  onChange(value) {
    console.log('change', value);
  },
  onSelect(value) {
    console.log('select ', value);
  },
  onClick(e) {
    const props = this.props;
    const overlayProps = props.overlay.props;
    if (!('visible' in props)) {
      this.setState({
        visible: false,
      });
    }
    if (overlayProps.onClick) {
      overlayProps.onClick(e);
    }
  },
  onVisibleChange(v) {
    const props = this.props;
    if (!('visible' in props)) {
      this.setState({
        visible: v,
      });
    }
    props.onVisibleChange(v);
  },
  getPopupElement() {
    const props = this.props;
    return React.cloneElement(props.overlay, {
      // prefixCls: `${props.prefixCls}-menu`,
      onClick: this.onClick,
    });
  },
  afterVisibleChange(visible) {
    if (visible && this.props.minOverlayWidthMatchTrigger) {
      const overlayNode = this.refs.trigger.getPopupDomNode();
      const rootNode = ReactDOM.findDOMNode(this);
      if (rootNode.offsetWidth > overlayNode.offsetWidth) {
        overlayNode.style.width = rootNode.offsetWidth + 'px';
      }
    }
  },
  render() {
    const {prefixCls, children,
      transitionName, animation,
      align, placement,
      overlayClassName, overlayStyle,
      trigger} = this.props;
    return (<Trigger prefixCls={prefixCls}
                     ref="trigger"
                     popupClassName={overlayClassName}
                     popupStyle={overlayStyle}
                     builtinPlacements={placements}
                     action={trigger}
                     popupPlacement={placement}
                     popupAlign={align}
                     popupTransitionName={transitionName}
                     popupAnimation={animation}
                     popupVisible={this.state.visible}
                     afterPopupVisibleChange={this.afterVisibleChange}
                     popup={this.getPopupElement()}
                     onPopupVisibleChange={this.onVisibleChange}
      >{children}</Trigger>);
  },
});

const Demo = React.createClass({
  getInitialState() {
    return {
      visible: false,
      inputValue: '',
      sel: '',
    };
  },
  onChange(event) {
    this.setState({
      inputValue: event.target.value,
    });
  },
  onVisibleChange(visible) {
    this.setState({
      visible: visible,
    });
  },
  onSelect(info) {
    console.log('selected: ', info);
    this.setState({
      visible: false,
      sel: info.node.props.title,
    });
  },
  filterTreeNode(treeNode) {
    console.log(treeNode);
    // 根据 key 进行搜索，可以根据其他数据，如 value
    return this.state.inputValue && treeNode.props.eventKey.indexOf(this.state.inputValue) > -1;
  },
  render() {
    const loop = data => {
      return data.map((item) => {
        if (item.children) {
          return <TreeNode key={item.key} title={item.key}>{loop(item.children)}</TreeNode>;
        }
        return <TreeNode key={item.key} title={item.key} />;
      });
    };
    const overlay = (<div>
      <input placeholder="请筛选" value={this.state.inputValue} onChange={this.onChange} />
      <Tree defaultExpandAll={false} onSelect={this.onSelect} filterTreeNode={this.filterTreeNode}>
        {loop(gData)}
      </Tree>
    </div>);

    return (<div style={{padding: '10px 30px'}}>
      <h3>tree in dropdown</h3>
      <DropdownTree trigger={['click']}
         onVisibleChange={this.onVisibleChange}
         visible={this.state.visible}
         closeOnSelect={false}
         overlay={overlay} animation="slide-up">
        <div className="demo-dropdown-trigger">{this.state.sel}</div>
      </DropdownTree>
    </div>);
  },
});

ReactDOM.render(<Demo />, document.getElementById('__react-content'));