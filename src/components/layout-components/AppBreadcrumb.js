import React, { useMemo } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Breadcrumb } from 'antd';
import { useNavigationConfig } from 'configs/NavigationConfig';

function buildBreadcrumbData(navigationConfig) {
  const data = {
    '/app': 'Home',
  };
  navigationConfig.forEach((elm) => {
    const assignBreadcrumb = (obj) => (data[obj.path] = obj.title);
    assignBreadcrumb(elm);
    if (elm.submenu) {
      elm.submenu.forEach((subElm) => {
        assignBreadcrumb(subElm);
        if (subElm.submenu) {
          subElm.submenu.forEach((subSubElm) => {
            assignBreadcrumb(subSubElm);
          });
        }
      });
    }
  });
  return data;
}

const BreadcrumbRoute = withRouter((props) => {
  const { location } = props;
  const navigationConfig = useNavigationConfig();
  const breadcrumbData = useMemo(
    () => buildBreadcrumbData(navigationConfig),
    [navigationConfig]
  );
  const pathSnippets = location.pathname.split('/').filter((i) => i);
  const buildBreadcrumb = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    return (
      <Breadcrumb.Item key={url}>
        <Link to={url}>{breadcrumbData[url]}</Link>
      </Breadcrumb.Item>
    );
  });

  return <Breadcrumb>{buildBreadcrumb}</Breadcrumb>;
});

export function AppBreadcrumb() {
  return <BreadcrumbRoute />;
}

export default AppBreadcrumb;
