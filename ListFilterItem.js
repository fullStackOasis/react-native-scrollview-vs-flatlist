import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';

const ListFilterItemView = styled.View`
  justify-content: center;
  align-items: center;
  width: 30px;
  color: purple;
`;

const ListFilterItemBoxView = styled.View`
  width: 18px;
  justify-content: center;
  align-items: center;
  color: red;
`;

/** Properties for the vertical alpha picker */
const ListFilterItemText = styled.Text`
  font-size: 20px;
  color: lightgreen;
`;

export function ListFilterItem({ title, active = false }) {
  return (
    <ListFilterItemView>
      <ListFilterItemBoxView active={active}>
        <ListFilterItemText active={active}>{title}</ListFilterItemText>
      </ListFilterItemBoxView>
    </ListFilterItemView>
  );
}

ListFilterItem.propTypes = {
  title: PropTypes.string,
  height: PropTypes.number,
  active: PropTypes.bool
};
